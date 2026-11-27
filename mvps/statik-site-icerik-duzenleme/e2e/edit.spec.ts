import { expect, test } from "@playwright/test";
import { editHeading, openSample, PNG, replaceFirstCardImage } from "./helpers";

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

test("değiştirilen görselin alt metni düzenlenir, indirilen dosyaya yazılır, geri alınınca eski haline döner", async ({ page }) => {
  const frame = await openSample(page);
  await replaceFirstCardImage(page);
  const alt = page.getByLabel(/Görsel açıklaması/);
  await expect(alt).toHaveValue("Simit");
  await alt.fill("Susamlı taze simit");
  const img = frame.locator(".kart img").first();
  await expect(img).toHaveAttribute("alt", "Susamlı taze simit");

  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "İndir" }).click();
  const stream = await (await dl).createReadStream();
  let out = "";
  for await (const c of stream) out += c.toString();
  expect(out).toMatch(/<img src="data:image\/png;base64,[^"]+" alt="Susamlı taze simit">/);
  expect(out).not.toContain('alt="Simit"');

  await page.getByRole("list", { name: "Değişiklikler" }).getByRole("button", { name: "Geri al" }).click();
  await expect(img).toHaveAttribute("alt", "Simit");
  await expect(img).toHaveAttribute("src", "gorseller/simit.svg");
});

test("tek tırnaklı alt'a kesme işaretli açıklama yazmak sayfayı bozmaz, script çalıştırmaz (K1)", async ({ page, browser }) => {
  await page.goto("/");
  await page.getByTestId("html-upload").setInputFiles({
    name: "vitrin.html",
    mimeType: "text/html",
    buffer: Buffer.from("<!doctype html><html><head><title>Fırın</title></head><body><h1>Fırın</h1><img src='vitrin.jpg' alt='Vitrin'></body></html>"),
  });
  const frame = page.frameLocator('iframe[title="Önizleme"]');
  const chooser = page.waitForEvent("filechooser");
  await frame.locator("img").click();
  await (await chooser).setFiles({ name: "yeni.png", mimeType: "image/png", buffer: PNG });
  const alt = page.getByLabel(/Görsel açıklaması/);
  await expect(alt).toHaveValue("Vitrin");
  const payload = `Ayşe'nin vitrini' onload='document.title="XSS"`;
  await alt.fill(payload);

  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "İndir" }).click();
  const stream = await (await dl).createReadStream();
  let out = "";
  for await (const c of stream) out += c.toString();

  const check = await browser.newPage();
  await check.setContent(out, { waitUntil: "load" });
  const img = check.locator("img");
  await expect(img).toHaveAttribute("alt", payload);
  expect(await img.evaluate((el) => el.getAttributeNames().sort())).toEqual(["alt", "src"]);
  expect(await check.title()).toBe("Fırın");
  await check.close();
});
