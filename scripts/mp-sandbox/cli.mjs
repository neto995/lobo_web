import { constants, lstatSync, mkdirSync, openSync, readFileSync, closeSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { createReceiver, destinations, readApi, requireSafe, validateConfig, validatePayment, validatePreference, validateSeller } from "./core.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const privateDir = resolve(root, ".mp-sandbox");
const [command, ...args] = process.argv.slice(2);
const emit = (value) => console.log(JSON.stringify(value, null, 2));

function privateFile(name) {
  const dir = lstatSync(privateDir);
  requireSafe(dir.isDirectory() && !dir.isSymbolicLink() && (dir.mode & 0o077) === 0 && dir.uid === process.getuid(), "PRIVATE_DIRECTORY_REQUIRED");
  const path = resolve(privateDir, name);
  const stat = lstatSync(path);
  requireSafe(stat.isFile() && !stat.isSymbolicLink() && (stat.mode & 0o077) === 0 && stat.uid === process.getuid() && stat.size <= 8192, "PRIVATE_FILE_REQUIRED");
  const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try { return readFileSync(fd, "utf8"); } finally { closeSync(fd); }
}

try {
  // macOS injects this locale hint even after env -i; it is not application config.
  delete process.env.__CF_USER_TEXT_ENCODING;
  requireSafe(Object.keys(process.env).every((key) => ["PATH", "LC_ALL"].includes(key)), "USE_ISOLATED_RUN_SH");
  process.umask(0o077);
  if (command === "init") {
    mkdirSync(privateDir, { mode: 0o700 });
    writeFileSync(resolve(privateDir, "config.json"), JSON.stringify({ sandboxConfirmed: false, country: "MX", sellerId: "", buyerId: "", origin: "" }, null, 2) + "\n", { mode: 0o600, flag: "wx" });
    for (const name of ["seller-token.txt", "webhook-secret.txt"]) writeFileSync(resolve(privateDir, name), "", { mode: 0o600, flag: "wx" });
    mkdirSync(resolve(privateDir, "tunnel-home"), { mode: 0o700 });
    writeFileSync(resolve(privateDir, "tunnel-home/config.json"), "{}\n", { mode: 0o600, flag: "wx" });
    emit({ initialized: true, credentialsWritten: false });
  } else if (command === "isolation") {
    emit({ inheritedCredentials: false, envFilesLoaded: false, environmentKeys: Object.keys(process.env), transactionsEnabled: false });
  } else if (command === "tunnel") {
    const home = resolve(privateDir, "tunnel-home");
    const child = spawn(resolve(privateDir, "cloudflared"), ["tunnel", "--config", resolve(home, "config.json"), "--no-autoupdate", "--url", "http://127.0.0.1:3199", "--protocol", "http2", "--metrics", "127.0.0.1:3198"], {
      cwd: home, env: { PATH: "/usr/bin:/bin", HOME: home }, stdio: "inherit",
    });
    for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
    child.on("error", () => { console.error("TUNNEL_START_FAILED"); process.exitCode = 1; });
    child.on("exit", (code) => { process.exitCode = code ?? 0; });
  } else if (["serve", "destinations", "seller", "preference", "payment"].includes(command)) {
    const config = JSON.parse(privateFile("config.json"));
    if (command === "serve") {
      const secret = privateFile("webhook-secret.txt").trim();
      if (secret) { validateConfig(config); destinations(config.origin); requireSafe(secret.length >= 16, "INVALID_WEBHOOK_SECRET"); }
      const server = createReceiver({ config, secret, log: emit });
      server.on("error", () => { console.error("RECEIVER_START_FAILED"); process.exitCode = 1; });
      server.listen(3199, "127.0.0.1", () => emit({ receiver: "http://127.0.0.1:3199", webhookEnabled: Boolean(secret), outboundRequests: false }));
      for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => { server.closeAllConnections(); server.close(); });
    } else if (command === "destinations") {
      validateConfig(config);
      emit(destinations(config.origin));
    } else {
      validateConfig(config);
      const token = privateFile("seller-token.txt").trim();
      const seller = await readApi("seller", null, token);
      const identity = validateSeller(seller, config);
      if (command === "seller") emit(identity);
      else {
        const [id, preferenceIdOrPlan, plan] = args;
        const preference = await readApi("preference", command === "payment" ? preferenceIdOrPlan : id, token);
        const checked = validatePreference(preference, config, command === "payment" ? plan : preferenceIdOrPlan);
        if (command === "preference") emit(checked);
        else emit(validatePayment(await readApi("payment", id, token), preference, config, plan));
      }
    }
  } else {
    throw new Error("COMMAND_REQUIRED");
  }
} catch {
  // Never echo provider bodies, paths, configuration, or parser errors containing secrets.
  console.error("SANDBOX_CHECK_FAILED: revisar comando, permisos y configuracion privada; no se muestran datos sensibles.");
  process.exitCode = 1;
}
