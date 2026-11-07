import { test, expect } from "@playwright/test";

test("rutas comerciales siguen publicas, con redireccion y cabeceras intactas", async ({ request }) => {
  for (const path of ["/", "/calculadora", "/calculadora-comida-para-perros", "/comida-cocinada-para-perros-guadalajara", "/articulos", "/success", "/pending", "/failure", "/terminos-y-condiciones", "/robots.txt", "/sitemap.xml"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(new URL(response.url()).pathname, path).toBe(path);
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
  }
  const redirect = await request.get("/comida-para-perros-guadalajara", { maxRedirects: 0 });
  expect(redirect.status()).toBe(301);
  expect(redirect.headers().location).toBe("/comida-cocinada-para-perros-guadalajara");
});

test("imagenes optimizadas y contenido visible en movil y escritorio", async ({ page, request }) => {
  const optimized = await request.get("/_next/image?url=%2Flobo_brutal.png&w=640&q=75");
  expect(optimized.status()).toBe(200);
  expect(optimized.headers()["content-type"]).toMatch(/^image\//);
  expect((await optimized.body()).length).toBeGreaterThan(1000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect.poll(() => page.locator("img").evaluateAll((images) => images.some((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0 && image.getBoundingClientRect().width > 0))).toBe(true);
    await page.screenshot({ path: `test-results/security-home-${width}.png`, fullPage: true });
    await page.goto("/calculadora");
    await expect(page.locator("h1")).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("Preview bloquea checkout y conserva las demas APIs sin llamadas a proveedores", async ({ request }) => {
  for (const data of ["{", { planId: "invalid-plan" }, { planId: "plan-chico-unico" }, { planId: "plan-mediano-unico" }]) {
    const response = await request.post("/api/checkout", { data });
    expect(response.status()).toBe(403);
    expect(response.headers()["cache-control"]).toBe("no-store");
    expect(await response.json()).toEqual({ error: "Payments are unavailable in this environment" });
  }
  expect((await request.get("/api/checkout")).status()).toBe(405);
  expect((await request.get("/api/whatsapp/webhook")).status()).toBe(403);
  const ignoredEvent = await request.post("/api/whatsapp/webhook", { data: {} });
  expect(ignoredEvent.status()).toBe(200);
  expect(await ignoredEvent.text()).toBe("EVENT_RECEIVED");
});

test("Preview deshabilita los cinco pagos y no entrega enlaces productivos al navegador", async ({ page, request }) => {
  const html = await (await request.get("/")).text();
  expect(html).not.toMatch(/https:\/\/(?:www\.)?(?:mpago\.la|mercadopago\.com)/);
  await page.goto("/");
  await page.locator("#planes summary").filter({ hasText: "Prefiero compra única" }).click();
  const buttons = page.locator("#planes button");
  await expect(buttons).toHaveCount(5);
  for (const button of await buttons.all()) await expect(button).toBeDisabled();
  await expect(page.locator('a[href*="mpago.la"], a[href*="mercadopago.com"]')).toHaveCount(0);
});
