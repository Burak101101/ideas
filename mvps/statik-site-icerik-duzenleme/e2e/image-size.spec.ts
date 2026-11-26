import { expect, test, type Page } from "@playwright/test";
import { openSample } from "./helpers";

/** A phone-sized, hard-to-compress JPEG generated in the browser (no fixture file needed). */
async function phonePhoto(page: Page): Promise<Buffer> {
  const b64 = await page.evaluate(async () => {
    const c = document.createElement("canvas");
    c.width = 4032;
    c.height = 3024;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(c.width, c.height);
    let seed = 7;
    for (let i = 0; i < img.data.length; i += 4) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      img.data[i] = seed & 255;
      img.data[i + 1] = (seed >> 8) & 255;
      img.data[i + 2] = (seed >> 16) & 255;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), "image/jpeg", 0.92));
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let s = "";
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(s);
  });
  return Buffer.from(b64, "base64");
}

async function pickForFirstCard(page: Page, buffer: Buffer) {
  const frame = page.frameLocator('iframe[title="Önizleme"]');
  const chooser = page.waitForEvent("filechooser");
  await frame.locator(".kart img").first().click();
  await (await chooser).setFiles({ name: "vitrin.jpg", mimeType: "image/jpeg", buffer });
}

async function downloadedHtml(page: Page): Promise<string> {
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "İndir" }).click();
  const stream = await (await dl).createReadStream();
  const chunks: Buffer[] = [];
  for await (const c of stream) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

test("Ö1: telefon fotoğrafı tarayıcıda küçültülür, sayfa makul boyutta kalır", async ({ page }) => {
  const frame = await openSample(page);
  const photo = await phonePhoto(page);
  expect(photo.length).toBeGreaterThan(2 * 1024 * 1024);

  await pickForFirstCard(page, photo);
  const img = frame.locator(".kart img").first();
  await expect(img).toHaveAttribute("src", /^data:image\/jpeg;base64,/);
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBe(1600);
  expect(await img.evaluate((el: HTMLImageElement) => el.naturalHeight)).toBe(1200);
  await expect(page.getByRole("status").filter({ hasText: "küçültüldü" })).toContainText("1600×1200 px");
  await expect(page.getByRole("list", { name: "Değişiklikler" })).toContainText("vitrin.jpg");

  const out = await downloadedHtml(page);
  expect(out.length).toBeLessThan(photo.length / 2);
  expect(out.length).toBeLessThan(1.5 * 1024 * 1024);
});

test("Ö1: küçültme kapatılınca görsel olduğu gibi gömülür ve uyarı çıkar", async ({ page }) => {
  const frame = await openSample(page);
  const photo = await phonePhoto(page);
  await page.getByLabel("Büyük görselleri küçült").uncheck();
  await pickForFirstCard(page, photo);
  const img = frame.locator(".kart img").first();
  await expect(img).toHaveAttribute("src", /^data:image\/jpeg;base64,/);
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBe(4032);
  await expect(page.getByRole("status").filter({ hasText: "olduğu gibi gömülünce" })).toBeVisible();
  const out = await downloadedHtml(page);
  expect(out.length).toBeGreaterThan(photo.length);
});

test("küçük PNG olduğu gibi kalır (yeniden kodlanmaz)", async ({ page }) => {
  const frame = await openSample(page);
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==", "base64");
  const chooser = page.waitForEvent("filechooser");
  await frame.locator(".kart img").first().click();
  await (await chooser).setFiles({ name: "k.png", mimeType: "image/png", buffer: png });
  await expect(frame.locator(".kart img").first()).toHaveAttribute("src", `data:image/png;base64,${png.toString("base64")}`);
  await expect(page.getByText("küçültüldü")).toHaveCount(0);
});
