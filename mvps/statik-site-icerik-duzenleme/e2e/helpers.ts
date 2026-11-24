import { expect, type Page } from "@playwright/test";

// 1x1 red PNG
export const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==", "base64");

export async function openSample(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Örnek siteyi aç" }).click();
  const frame = page.frameLocator('iframe[title="Önizleme"]');
  await expect(frame.locator("h1")).toHaveText("Taş fırından sıcak ekmek");
  return frame;
}

export async function editHeading(page: Page, text: string) {
  const frame = page.frameLocator('iframe[title="Önizleme"]');
  const h1 = frame.locator("h1");
  await h1.click();
  await h1.fill(text);
  await h1.press("Enter");
}

export async function replaceFirstCardImage(page: Page) {
  const frame = page.frameLocator('iframe[title="Önizleme"]');
  const chooser = page.waitForEvent("filechooser");
  await frame.locator(".kart img").first().click();
  await (await chooser).setFiles({ name: "yeni-simit.png", mimeType: "image/png", buffer: PNG });
}
