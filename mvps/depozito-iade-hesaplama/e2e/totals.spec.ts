import { expect, test } from "@playwright/test";
import { addDeduction, fillBasics, open } from "./helpers";

test("refund updates as deductions are added and removed, and interest is added", async ({ page }) => {
  await open(page);
  await fillBasics(page, { tenant: "Sam Park", deposit: "1500", moveOut: "2026-11-01", state: "California" });
  await addDeduction(page, "Cleaning", "200", "cleaning");
  await addDeduction(page, "Wall repair", "150", "damage");
  await expect(page.getByTestId("refund")).toHaveText("$1,150.00");

  await page.getByLabel("Interest owed to tenant ($)", { exact: true }).fill("12");
  await expect(page.getByTestId("refund")).toHaveText("$1,162.00");
  await page.getByLabel("Interest owed to tenant ($)", { exact: true }).fill("");

  await page.getByRole("button", { name: "Remove Wall repair" }).click();
  await expect(page.getByTestId("refund")).toHaveText("$1,300.00");
});

test("deductions above the deposit show $0 refund and the amount owed", async ({ page }) => {
  await open(page);
  await fillBasics(page, { tenant: "Ari Cole", deposit: "1500", moveOut: "2026-11-01", state: "California" });
  await addDeduction(page, "Unpaid rent", "1800", "unpaid rent");
  await expect(page.getByTestId("refund")).toHaveText("$0.00");
  await expect(page.getByTestId("owed")).toHaveText("$300.00");
});
