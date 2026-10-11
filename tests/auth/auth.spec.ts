import { test, expect, type Page } from "@playwright/test";

const password = "test-password-123";
async function login(page: Page, email = "a@example.com", pass = password) {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(pass);
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/\/mi-expediente$/);
  await expect(page.getByRole("button", { name: "Crear primer expediente" })).toBeVisible();
}

test.beforeEach(async ({ request }) => { await request.post("http://127.0.0.1:54329/__reset"); });

test("ruta protegida, CSRF y destinos externos", async ({ page, request }) => {
  await page.goto("/mi-expediente");
  await expect(page).toHaveURL(/\/login$/);
  const csrf = await request.post("/auth/login", { headers: { origin: "https://evil.example" }, form: { email: "a@example.com", password } });
  expect(csrf.status()).toBe(403);
  await page.goto(`/auth/confirm?type=email&token_hash=bad&next=https://evil.example`);
  await expect(page).toHaveURL(/\/login\?estado=enlace-invalido$/);
  await expect(page.getByRole("alert").filter({ hasText: "no es válido" })).toBeVisible();
});

test("registro, confirmación explícita y rechazo de enlace reutilizado", async ({ page }) => {
  await page.goto("/registro");
  await page.getByLabel("Correo electrónico").fill("new@example.com");
  await page.getByLabel("Contraseña", { exact: true }).fill(password);
  await page.getByLabel("Confirmar contraseña").fill(password);
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page.getByRole("status")).toContainText("recibirás un correo");
  const confirmation = `/auth/confirm?type=email&token_hash=${"a".repeat(64)}&next=https://evil.example`;
  await page.goto(confirmation);
  await expect(page).toHaveURL(/\/registro\?confirmar=1$/);
  await page.getByRole("button", { name: "Confirmar mi correo" }).click();
  await expect(page).toHaveURL(/\/mi-expediente$/);
  await expect(page.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto(confirmation);
  await page.getByRole("button", { name: "Confirmar mi correo" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "ya fue utilizado" })).toBeVisible();
});

test("sesión SSR persistente, cookies HttpOnly, legacy intacto y logout entre pestañas", async ({ page, context }) => {
  await page.goto("/login");
  await page.evaluate(() => localStorage.setItem("lobo.mi-expediente.v1", "legacy-untouched"));
  await login(page);
  const authCookies = (await context.cookies()).filter((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
  expect(authCookies.length).toBeGreaterThan(0);
  expect(authCookies.every((c) => c.httpOnly && c.sameSite === "Lax")).toBe(true);
  expect(await page.evaluate(() => document.cookie)).not.toContain("auth-token");
  await expect(page.getByText(/No se sincronizan entre dispositivos/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Crear primer expediente" })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("lobo.mi-expediente.v1"))).toBe("legacy-untouched");
  const other = await context.newPage();
  await other.goto("/mi-expediente");
  await expect(other.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();
  await other.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(other).toHaveURL(/\/login$/);
  await page.bringToFront();
  await expect(page).toHaveURL(/\/login$/);
  await page.goBack();
  await expect(page.getByRole("button", { name: "Crear primer expediente" })).not.toBeVisible();
});

test("recuperación consume OTP al guardar y exige nueva autenticación", async ({ page }) => {
  await page.goto("/recuperar-contrasena");
  await page.getByLabel("Correo electrónico").fill("a@example.com");
  await page.getByRole("button", { name: "Enviar enlace" }).click();
  await expect(page.getByRole("status")).toContainText("Si existe una cuenta");
  await page.goto("/restablecer-contrasena");
  await expect(page.getByText("Abre el enlace de recuperación")).toBeVisible();
  await page.goto(`/auth/confirm?type=recovery&token_hash=${"b".repeat(64)}`);
  await expect(page).toHaveURL(/\/restablecer-contrasena$/);
  await page.getByLabel("Contraseña", { exact: true }).fill("new-password-456");
  await page.getByLabel("Confirmar contraseña").fill("new-password-456");
  await page.getByRole("button", { name: "Guardar contraseña" }).click();
  await expect(page).toHaveURL(/estado=restablecida/);
  await login(page, "a@example.com", "new-password-456");
});

test("formularios adaptables sin desbordamiento en móvil y escritorio", async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/registro");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/registro-${width}.png`, fullPage: true });
  }
  await login(page);
  await page.setViewportSize({ width: 375, height: 850 });
  await expect(page.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/expediente-mobile.png", fullPage: true });
});

test("renueva una sesión expirada y rechaza cookies falsificadas", async ({ page, context }) => {
  await login(page);
  const original = (await context.cookies()).find((c) => c.name.endsWith("-auth-token"))!;
  const session = JSON.parse(Buffer.from(original.value.slice(7), "base64url").toString());
  session.expires_at = Math.floor(Date.now() / 1000) - 10;
  await context.addCookies([{ ...original, value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}` }]);
  const response = await page.goto("/mi-expediente");
  await expect(page.getByRole("button", { name: "Crear primer expediente" })).toBeVisible();
  // Next dev replaces page cache headers; production must preserve no-store.
  expect(response?.headers()["cache-control"]).toContain(process.env.PLAYWRIGHT_PRODUCTION === "1" ? "no-store" : "no-cache");
  const sessionResponse = await context.request.get("/auth/session");
  expect(sessionResponse.headers()["cache-control"]).toContain("no-store");
  const renewed = (await context.cookies()).find((c) => c.name.endsWith("-auth-token"))!;
  expect(renewed.value).not.toBe(original.value);
  const invalid = JSON.parse(Buffer.from(renewed.value.slice(7), "base64url").toString());
  invalid.access_token = "forged-token";
  await context.addCookies([{ ...renewed, value: `base64-${Buffer.from(JSON.stringify(invalid)).toString("base64url")}` }]);
  await page.goto("/mi-expediente");
  await expect(page).toHaveURL(/\/login$/);
});

test("cambiar de A a B no muestra el expediente de A y conserva legacy", async ({ page, context }) => {
  await login(page);
  await page.evaluate(() => localStorage.setItem("lobo.mi-expediente.v1", "legacy-original"));
  await page.getByRole("button", { name: "Crear primer expediente" }).click();
  await page.getByLabel("Nombre*").fill("Nala A");
  await page.getByLabel("Peso inicial (kg)*").fill("12");
  await page.getByLabel("Peso objetivo (kg)*").fill("11");
  await page.getByRole("button", { name: "Crear expediente", exact: true }).click();
  await expect(page.getByText("Nala A", { exact: true }).first()).toBeVisible();
  const other = await context.newPage();
  await login(other, "b@example.com");
  await page.bringToFront();
  await expect(page.getByRole("button", { name: "Crear primer expediente" })).toBeVisible();
  await expect(page.getByText("Nala A", { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("lobo.mi-expediente.v1"))).toBe("legacy-original");
  expect(await page.evaluate(() => localStorage.getItem("lobo.mi-expediente.auth-v1.11111111-1111-4111-8111-111111111111"))).toContain("Nala A");
});

test("login incorrecto y pérdida de red no exponen datos ni errores internos", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill("a@example.com");
  await page.getByLabel("Contraseña", { exact: true }).fill("wrong-password");
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "No pudimos iniciar sesión" })).toBeVisible();
  await login(page);
  await page.route("**/auth/session", (route) => route.abort());
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByText("No pudimos verificar tu sesión. Revisa tu conexión.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Crear primer expediente" })).toHaveCount(0);
});
