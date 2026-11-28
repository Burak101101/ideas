import { expect, test } from "@playwright/test";
import { fillBasics, open } from "./helpers";

test("negative deposit and interest are rejected and cannot be saved or printed (Ö1)", async ({ page }) => {
  await open(page);
  await fillBasics(page, { tenant: "Neg Case", deposit: "-500", moveOut: "2026-11-01", state: "California" });
  await page.getByLabel("Interest owed to tenant ($)", { exact: true }).fill("-20");
  await expect(page.getByText("Amount can't be negative.")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Save move-out" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Create statement" })).toBeDisabled();
  await expect(page.getByText("-$500.00")).toHaveCount(0);
  await expect(page.getByTestId("totals-deposit")).toHaveText("$0.00");

  await page.getByLabel("Deposit amount ($)", { exact: true }).fill("500");
  await page.getByLabel("Interest owed to tenant ($)", { exact: true }).fill("");
  await expect(page.getByRole("button", { name: "Save move-out" })).toBeEnabled();
});

test("overflowing amounts show an error instead of silently becoming $0 (Y6)", async ({ page }) => {
  await open(page);
  await fillBasics(page, { tenant: "Big Number", deposit: "1e400", moveOut: "2026-11-01", state: "California" });
  await expect(page.getByText("Amount is too large.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save move-out" })).toBeDisabled();
});

test("deposit is required to save (Y4)", async ({ page }) => {
  await open(page);
  await fillBasics(page, { tenant: "No Deposit", moveOut: "2026-11-01", state: "California" });
  await expect(page.getByRole("button", { name: "Save move-out" })).toBeDisabled();
  await expect(page.getByText(/deposit amount/i).last()).toBeVisible();
});

test("a broken saved record does not crash the app (Y1)", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-23T12:00:00"));
  await page.addInitScript(() => {
    if (sessionStorage.getItem("seeded")) return;
    sessionStorage.setItem("seeded", "1");
    const base = { tenantName: "Fine", propertyAddress: "", deposit: 100, stateCode: "CA", interest: 0, deductions: [] };
    localStorage.setItem(
      "deposit-tracker:v1",
      JSON.stringify([
        { ...base, id: "ok", moveOutDate: "2026-11-01" },
        { ...base, id: "bad", tenantName: "Broken", moveOutDate: "11/01/2026" },
      ]),
    );
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Move-Out Ledger" })).toBeVisible();
  await expect(page.getByTestId("record")).toHaveCount(1);
  await expect(page.getByTestId("record")).toContainText("Fine");
});

test("a very long unbroken tenant name does not widen the page (Y2)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await open(page);
  await fillBasics(page, { tenant: "A".repeat(120), deposit: "100", moveOut: "2026-11-01", state: "California" });
  await page.getByRole("button", { name: "Save move-out" }).click();
  await expect(page.getByTestId("record")).toHaveCount(1);
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(375);
});

test("on mobile the deadline and refund are visible without scrolling (Y5)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await open(page);
  await fillBasics(page, { tenant: "Mo Bile", deposit: "1000", moveOut: "2026-11-01", state: "California" });
  const bar = page.getByTestId("summary-bar");
  await expect(bar).toBeInViewport();
  await expect(bar).toContainText("Nov 22, 2026");
  await expect(bar).toContainText("$1,000.00");
});
