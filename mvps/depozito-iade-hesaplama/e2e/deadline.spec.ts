import { expect, test } from "@playwright/test";
import { fillBasics, open } from "./helpers";

test("California move-out on 2026-11-01 is due 2026-11-22 with a source link", async ({ page }) => {
  await open(page);
  await fillBasics(page, { tenant: "Jordan Lee", deposit: "1500", moveOut: "2026-11-01", state: "California" });
  await expect(page.getByTestId("deadline")).toHaveText("November 22, 2026");
  await expect(page.getByTestId("days-left")).toHaveText("1 day past the deadline");
  const link = page.getByRole("link", { name: /Source: Cal\. Civ\. Code § 1950\.5/ });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", /^https:\/\//);
});

test("shows the not-legal-advice notice", async ({ page }) => {
  await open(page);
  await expect(page.getByRole("note")).toContainText("Not legal advice");
});
