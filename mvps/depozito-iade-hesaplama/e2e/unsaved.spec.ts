import { expect, test } from "@playwright/test";
import { addDeduction, fillBasics, open } from "./helpers";

async function twoRecords(page: import("@playwright/test").Page) {
  await open(page);
  await fillBasics(page, { tenant: "First One", deposit: "999", moveOut: "2026-11-10", state: "Ohio" });
  await page.getByRole("button", { name: "Save move-out" }).click();
  await page.getByRole("button", { name: "Start a new one" }).click();
  await fillBasics(page, { tenant: "Second One", deposit: "500", moveOut: "2026-11-12", state: "Ohio" });
  await page.getByRole("button", { name: "Save move-out" }).click();
}

test("switching records with unsaved edits asks first; cancelling keeps the edits (Ö2)", async ({ page }) => {
  await twoRecords(page);
  await page.getByRole("button", { name: "Edit First One" }).click();
  await page.getByLabel("Deposit amount ($)", { exact: true }).fill("900");
  await addDeduction(page, "Paint touch-up", "80", "damage");
  await expect(page.getByText("Unsaved changes")).toBeVisible();

  let message = "";
  page.once("dialog", (d) => {
    message = d.message();
    void d.dismiss();
  });
  await page.getByRole("button", { name: "Edit Second One" }).click();
  expect(message).toMatch(/unsaved changes/i);
  await expect(page.getByLabel("Tenant name", { exact: true })).toHaveValue("First One");
  await expect(page.getByLabel("Deposit amount ($)", { exact: true })).toHaveValue("900");
  await expect(page.getByRole("list", { name: "Deductions" })).toContainText("Paint touch-up");

  page.once("dialog", (d) => void d.accept());
  await page.getByRole("button", { name: "Edit Second One" }).click();
  await expect(page.getByLabel("Tenant name", { exact: true })).toHaveValue("Second One");
  await page.getByRole("button", { name: "Edit First One" }).click(); // clean form: no prompt
  await expect(page.getByLabel("Deposit amount ($)", { exact: true })).toHaveValue("999");
});

test("starting a new one with unsaved edits also asks (Ö2)", async ({ page }) => {
  await twoRecords(page);
  await page.getByLabel("Deposit amount ($)", { exact: true }).fill("550");
  page.once("dialog", (d) => void d.dismiss());
  await page.getByRole("button", { name: "Start a new one" }).click();
  await expect(page.getByLabel("Deposit amount ($)", { exact: true })).toHaveValue("550");
});

test("saved form switches without a prompt", async ({ page }) => {
  await twoRecords(page);
  let prompted = false;
  page.on("dialog", (d) => {
    prompted = true;
    void d.accept();
  });
  await page.getByRole("button", { name: "Edit First One" }).click();
  await expect(page.getByLabel("Tenant name", { exact: true })).toHaveValue("First One");
  expect(prompted).toBe(false);
  await expect(page.getByText("Unsaved changes")).toHaveCount(0);
});
