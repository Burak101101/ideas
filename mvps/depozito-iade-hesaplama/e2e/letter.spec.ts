import { expect, test } from "@playwright/test";
import { addDeduction, fillBasics, open } from "./helpers";

test("Create statement opens a printable itemized letter", async ({ page }) => {
  await open(page);
  await fillBasics(page, { tenant: "Robin Diaz", deposit: "1500", moveOut: "2026-11-01", state: "California" });
  await addDeduction(page, "Carpet cleaning", "200", "cleaning");
  await addDeduction(page, "Broken blinds", "150", "damage");
  await page.getByLabel("Interest owed to tenant ($)", { exact: true }).fill("12");
  await page.getByRole("button", { name: "Create statement" }).click();

  const letter = page.getByRole("article", { name: "Itemized security deposit statement" });
  await expect(letter).toBeVisible();
  for (const text of [
    "Robin Diaz",
    "November 1, 2026", // move-out
    "November 22, 2026", // deadline
    "November 23, 2026", // letter date
    "Carpet cleaning",
    "Broken blinds",
    "$1,500.00",
    "$200.00",
    "$150.00",
    "$12.00",
    "$350.00",
    "$1,162.00",
  ]) {
    await expect(letter).toContainText(text);
  }
  await expect(page.getByRole("button", { name: "Print" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(letter).toBeHidden();
});
