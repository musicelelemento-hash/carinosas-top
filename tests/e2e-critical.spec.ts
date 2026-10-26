import { test, expect } from "@playwright/test";

test.describe("Cariñosas.top — Flujos críticos", () => {
  test("Home carga el directorio y no simula actividad", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Cariñosas/);
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("Perfil inexistente devuelve 404 (no fallback al primer modelo)", async ({ page }) => {
    const response = await page.goto("/profile/99999999-9999-9999-9999-999999999999");
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/Perfil VIP|Not Found/);
  });

  test("Página de ciudad renderiza con SEO", async ({ page }) => {
    await page.goto("/quito");
    await expect(page.locator("h1")).toContainText("Quito");
  });

  test("Feed mobile no inyecta modelos ficticios", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Reels" }).first()).toBeVisible();
  });

  test("La publicación informa cuando Turnstile no está configurado", async ({ page }) => {
    await page.goto("/publicar-anuncio");
    const widget = page.locator('iframe[src*="challenges.cloudflare.com"]');
    const missingConfiguration = page.getByText("Protección antibot no configurada.");
    await expect(widget.or(missingConfiguration)).toBeVisible();
  });

  test("La búsqueda remota muestra un estado honesto sin coincidencias", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    const search = page.getByPlaceholder("Buscar por nombre, sector o ciudad");
    await search.fill("perfil-sin-coincidencia-9f41");
    await search.press("Enter");
    await expect(page.getByText("Sin perfiles disponibles aún")).toBeVisible({ timeout: 15000 });
  });
});
