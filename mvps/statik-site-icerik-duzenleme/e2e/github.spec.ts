import { expect, test } from "@playwright/test";
import { editHeading, openSample } from "./helpers";

test("GitHub alanları boşken commit eksik alanları söyler", async ({ page }) => {
  await openSample(page);
  await page.getByLabel("Dal").fill("");
  await page.getByRole("button", { name: "Commit et" }).click();
  await expect(page.getByTestId("gh-notice")).toHaveText("Eksik alanlar: Token, Repo, Dal, Dosya yolu.");
});

test("geçersiz token 401 ile reddedilince anlaşılır mesaj gösterilir", async ({ page }) => {
  let sawAuth = "";
  await page.route("https://api.github.com/**", async (route) => {
    sawAuth = route.request().headers()["authorization"] ?? "";
    await route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ message: "Bad credentials" }) });
  });
  await openSample(page);
  await editHeading(page, "Yeni Başlık");
  await page.getByLabel("Token").fill("gecersiz-token");
  await page.getByLabel("Repo").fill("ornek-kullanici/ornek-site");
  await page.getByLabel("Dosya yolu").fill("index.html");
  await page.getByRole("button", { name: "Commit et" }).click();
  await expect(page.getByTestId("gh-notice")).toContainText("GitHub token'ı reddetti (401)");
  expect(sawAuth).toBe("Bearer gecersiz-token");
  // page still works
  await expect(page.frameLocator('iframe[title="Önizleme"]').locator("h1")).toHaveText("Yeni Başlık");
  await expect(page.getByRole("list", { name: "Değişiklikler" }).getByRole("listitem")).toHaveCount(1);
});

test("geçerli yanıtta commit sha ile gönderilir ve bağlantı gösterilir", async ({ page }) => {
  let putBody: Record<string, string> = {};
  await page.route("https://api.github.com/**", async (route) => {
    const req = route.request();
    if (req.method() === "GET") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: "", sha: "eski-sha" }) });
    putBody = req.postDataJSON();
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ commit: { html_url: "https://github.com/x/y/commit/1", sha: "1" } }) });
  });
  await openSample(page);
  await editHeading(page, "Yeni Başlık");
  await page.getByLabel("Token").fill("t");
  await page.getByLabel("Repo").fill("ornek-kullanici/ornek-site");
  await page.getByLabel("Dosya yolu").fill("index.html");
  await page.getByRole("button", { name: "Commit et" }).click();
  await expect(page.getByTestId("gh-notice")).toContainText("Commit oluşturuldu");
  expect(putBody.sha).toBe("eski-sha");
  expect(Buffer.from(putBody.content, "base64").toString("utf8")).toContain("<h1>Yeni Başlık</h1>");
  // token is not persisted in the browser
  expect(await page.evaluate(() => JSON.stringify(localStorage) + JSON.stringify(sessionStorage))).not.toContain('"t"');
});
