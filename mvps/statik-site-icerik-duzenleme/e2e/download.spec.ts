import { readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { editHeading, openSample, replaceFirstCardImage } from "./helpers";

test("indirilen dosyada yalnızca düzenlenen öğeler değişir", async ({ page }) => {
  await openSample(page);
  await editHeading(page, "Yeni Başlık");
  await replaceFirstCardImage(page);

  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "İndir" }).click();
  const download = await dl;
  expect(download.suggestedFilename()).toBe("index.html");
  const out = await readFile((await download.path())!, "utf8");
  const original = await readFile(path.join(__dirname, "..", "public", "ornek", "index.html"), "utf8");

  expect(out).toContain("<h1>Yeni Başlık</h1>");
  expect(out).not.toContain("data-se-");
  // <style>/<link> and every untouched part are byte-identical
  const styleBlock = /<style>[\s\S]*?<\/style>/.exec(original)![0];
  expect(out).toContain(styleBlock);
  expect(out).toContain('<link rel="stylesheet" href="style.css">');
  const m = /src="(data:image\/png;base64,[^"]+)"/.exec(out)!;
  const rebuilt = out.replace("<h1>Yeni Başlık</h1>", "<h1>Taş fırından sıcak ekmek</h1>").replace(m[0], 'src="gorseller/simit.svg"');
  expect(rebuilt).toBe(original);
});
