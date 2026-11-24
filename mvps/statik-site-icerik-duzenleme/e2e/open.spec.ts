import { expect, test } from "@playwright/test";
import { openSample } from "./helpers";

test("örnek site açılır ve düzenlenebilir öğeler üzerine gelince vurgulanır", async ({ page }) => {
  const frame = await openSample(page);
  for (const sel of ["h1", ".kahraman p", ".kahraman-gorsel"]) {
    const el = frame.locator(sel).first();
    await expect(el).toHaveAttribute("data-se-id", /\d+/);
    await el.hover();
    await expect(el).toHaveCSS("outline-style", "dashed");
  }
  // the page's own stylesheet is applied in the preview
  await expect(frame.locator(".dugme")).toHaveCSS("background-color", "rgb(154, 52, 18)");
  await expect(page.getByText(/metin, \d+ görsel düzenlenebilir/)).toBeVisible();
});

test("yüklenen bir HTML dosyası yapılandırma olmadan açılır", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("html-upload").setInputFiles({
    name: "hakkimizda.html",
    mimeType: "text/html",
    buffer: Buffer.from("<!doctype html><html><head><title>x</title></head><body><h2>Biz kimiz</h2><p>Küçük bir atölye.</p></body></html>"),
  });
  const frame = page.frameLocator('iframe[title="Önizleme"]');
  await expect(frame.locator("h2")).toHaveAttribute("data-se-id", "0");
  await expect(frame.locator("p")).toHaveAttribute("data-se-id", "1");
  await expect(page.getByText("hakkimizda.html")).toBeVisible();
});
