import { expect, test } from "@playwright/test";
import { fillBasics, open } from "./helpers";

test("saved move-outs are sorted by deadline, labeled, and survive reload", async ({ page }) => {
  await open(page); // today = 2026-11-23
  // Washington, 30 days: 2026-12-31 → on track
  await fillBasics(page, { tenant: "Later Tenant", deposit: "900", moveOut: "2026-12-01", state: "Washington" });
  await page.getByRole("button", { name: "Save move-out" }).click();
  await page.getByRole("button", { name: "Start a new one" }).click();
  // California, 21 days: 2026-11-22 → overdue
  await fillBasics(page, { tenant: "Past Tenant", deposit: "1000", moveOut: "2026-11-01", state: "California" });
  await page.getByRole("button", { name: "Save move-out" }).click();
  await page.getByRole("button", { name: "Start a new one" }).click();
  // New York, 14 days: 2026-11-25 → due soon
  await fillBasics(page, { tenant: "Soon Tenant", deposit: "1200", moveOut: "2026-11-11", state: "New York" });
  await page.getByRole("button", { name: "Save move-out" }).click();

  const check = async () => {
    const rows = page.getByTestId("record");
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0)).toContainText("Past Tenant");
    await expect(rows.nth(0)).toContainText("Overdue");
    await expect(rows.nth(1)).toContainText("Soon Tenant");
    await expect(rows.nth(1)).toContainText("Due soon");
    await expect(rows.nth(2)).toContainText("Later Tenant");
    await expect(rows.nth(2)).toContainText("On track");
  };
  await check();
  await page.reload();
  await check();

  await page.getByRole("button", { name: "Delete Soon Tenant" }).click();
  await expect(page.getByTestId("record")).toHaveCount(2);
});

test("editing a saved move-out updates it instead of adding a copy", async ({ page }) => {
  await open(page);
  await fillBasics(page, { tenant: "Edit Me", deposit: "800", moveOut: "2026-11-10", state: "Ohio" });
  await page.getByRole("button", { name: "Save move-out" }).click();
  await page.getByRole("button", { name: "Edit Edit Me" }).click();
  await page.getByLabel("Deposit amount ($)", { exact: true }).fill("850");
  await page.getByRole("button", { name: "Update move-out" }).click();
  await expect(page.getByTestId("record")).toHaveCount(1);
  await expect(page.getByTestId("record")).toContainText("$850.00");
});
