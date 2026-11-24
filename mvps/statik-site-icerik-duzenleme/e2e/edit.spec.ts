import { expect, test } from "@playwright/test";
import { editHeading, openSample, replaceFirstCardImage } from "./helpers";

test("başlık yerinde değişir ve önizleme anında güncellenir", async ({ page }) => {
  const frame = await openSample(page);
  const h1 = frame.locator("h1");
  await h1.click();
  await h1.fill("Yeni Başlık");
  await expect(h1).toHaveText("Yeni Başlık");
  await expect(page.getByRole("list", { name: "Değişiklikler" }).getByRole("listitem")).toHaveCount(1);
  await h1.press("Enter");
  await expect(h1).not.toHaveAttribute("contenteditable", /.*/);
});

test("görsele tıklayıp yerel PNG seçilince önizlemedeki görsel değişir", async ({ page }) => {
  const frame = await openSample(page);
  await replaceFirstCardImage(page);
  await expect(frame.locator(".kart img").first()).toHaveAttribute("src", /^data:image\/png;base64,/);
  await expect(page.getByRole("list", { name: "Değişiklikler" })).toContainText("yeni-simit.png");
});

test("bağlantıya tıklamak sayfadan çıkarmaz, metnini düzenletir", async ({ page }) => {
  const frame = await openSample(page);
  const link = frame.locator(".dugme");
  await link.click();
  await link.fill("Hemen ara");
  await link.press("Enter");
  await expect(link).toHaveText("Hemen ara");
  await expect(frame.locator("h1")).toBeVisible();
});

test("iki değişiklikten birini geri almak önizlemeyi eski haline döndürür", async ({ page }) => {
  const frame = await openSample(page);
  await editHeading(page, "Yeni Başlık");
  await replaceFirstCardImage(page);
  const items = page.getByRole("list", { name: "Değişiklikler" }).getByRole("listitem");
  await expect(items).toHaveCount(2);
  await items.filter({ hasText: "Yeni Başlık" }).getByRole("button", { name: "Geri al" }).click();
  await expect(frame.locator("h1")).toHaveText("Taş fırından sıcak ekmek");
  await expect(items).toHaveCount(1);
  await expect(frame.locator(".kart img").first()).toHaveAttribute("src", /^data:image\/png/);
});
