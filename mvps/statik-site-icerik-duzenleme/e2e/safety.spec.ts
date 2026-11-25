import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { editHeading, openSample } from "./helpers";

const RICH = `<img src="x" onerror="alert(1)"><span style="color:red">kırmızı</span>`;

async function downloadText(page: Page) {
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "İndir" }).click();
  return readFile((await (await dl).path())!, "utf8");
}

const paragraph = (page: Page) => page.frameLocator('iframe[title="Önizleme"]').locator("p", { hasText: "Ekşi mayalı" });

test("K1: zengin metin yapıştırılınca yalnızca düz metin eklenir", async ({ page }) => {
  await openSample(page);
  const p = paragraph(page);
  await p.click();
  await p.evaluate((el, html) => {
    const dt = new DataTransfer();
    dt.setData("text/html", html);
    dt.setData("text/plain", " kırmızı");
    el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
  }, RICH);
  await expect(p).toContainText("kırmızı");
  await p.press("Enter");
  expect(await p.locator("img, span").count()).toBe(0);
  const out = await downloadText(page);
  expect(out).not.toContain("onerror");
  expect(out).not.toContain("color:red");
  expect(out).toMatch(/<strong>06:30<\/strong>'da ilk tepsi çıkar\. kırmızı<\/p>/);
});

test("K1: başka yoldan eklenen HTML de çıktıya ve önizlemeye girmeden temizlenir", async ({ page }) => {
  await openSample(page);
  const p = paragraph(page);
  await p.click();
  await p.evaluate((el, html) => el.ownerDocument.execCommand("insertHTML", false, html), RICH);
  await p.press("Enter");
  await expect(p).toContainText("kırmızı");
  expect(await p.locator("img, span").count()).toBe(0);
  await expect(p.locator("strong")).toHaveText("06:30");
  const out = await downloadText(page);
  expect(out).not.toContain("onerror");
  expect(out).not.toContain("color:red");
  expect(out).toMatch(/<strong>06:30<\/strong>'da ilk tepsi çıkar\.\s?kırmızı<\/p>/);
});

test("Ö2: kaydedilmemiş değişiklik varken sayfadan çıkmak uyarı verir", async ({ page }) => {
  await openSample(page);
  await editHeading(page, "Yeni Başlık");
  const dialog = page.waitForEvent("dialog");
  await page.close({ runBeforeUnload: true });
  const d = await dialog;
  expect(d.type()).toBe("beforeunload");
  await d.accept();
});

test("Ö2: indirdikten sonra çıkışta uyarı yok", async ({ page }) => {
  const dialogs: string[] = [];
  page.on("dialog", (d) => {
    dialogs.push(d.type());
    void d.accept();
  });
  await openSample(page);
  await editHeading(page, "Yeni Başlık");
  await downloadText(page);
  await expect(page.getByText("Tüm değişiklikler kaydedildi")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Örnek siteyi aç" })).toBeVisible();
  expect(dialogs).toEqual([]);
});

test("Ö2: değişiklik varken başka dosya açmak onay ister; vazgeçince değişiklikler kalır", async ({ page }) => {
  const frame = await openSample(page);
  await editHeading(page, "Yeni Başlık");
  page.once("dialog", (d) => {
    expect(d.type()).toBe("confirm");
    void d.dismiss();
  });
  await page.getByRole("button", { name: "Örnek siteyi aç" }).click();
  await expect(frame.locator("h1")).toHaveText("Yeni Başlık");
  await expect(page.getByRole("list", { name: "Değişiklikler" }).getByRole("listitem")).toHaveCount(1);

  page.once("dialog", (d) => void d.accept());
  await page.getByRole("button", { name: "Örnek siteyi aç" }).click();
  await expect(frame.locator("h1")).toHaveText("Taş fırından sıcak ekmek");
  await expect(page.getByText("Henüz değişiklik yok.")).toBeVisible();
});

test("Y1: görsel yerine başka dosya seçilince açıklayıcı mesaj çıkar", async ({ page }) => {
  const frame = await openSample(page);
  const chooser = page.waitForEvent("filechooser");
  await frame.locator(".kart img").first().click();
  await (await chooser).setFiles({ name: "notlar.txt", mimeType: "text/plain", buffer: Buffer.from("x") });
  await expect(page.getByRole("alert").filter({ hasText: "bir görsel değil" })).toBeVisible();
  await expect(page.getByText("Henüz değişiklik yok.")).toBeVisible();
});

test("Y2: Esc düzenlemeyi iptal eder", async ({ page }) => {
  const frame = await openSample(page);
  const h1 = frame.locator("h1");
  await h1.click();
  await h1.fill("Vazgeçilecek");
  await h1.press("Escape");
  await expect(h1).toHaveText("Taş fırından sıcak ekmek");
  await expect(page.getByText("Henüz değişiklik yok.")).toBeVisible();
});
