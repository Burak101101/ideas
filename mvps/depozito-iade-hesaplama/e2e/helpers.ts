import type { Page } from "@playwright/test";

export const TODAY = new Date("2026-11-23T12:00:00");

export async function open(page: Page) {
  await page.clock.setFixedTime(TODAY);
  await page.goto("/");
}

export async function fillBasics(
  page: Page,
  v: { tenant: string; deposit?: string; moveOut: string; state: string },
) {
  await page.getByLabel("Tenant name", { exact: true }).fill(v.tenant);
  if (v.deposit) await page.getByLabel("Deposit amount ($)", { exact: true }).fill(v.deposit);
  await page.getByLabel("Move-out date", { exact: true }).fill(v.moveOut);
  await page.getByLabel("State").selectOption({ label: v.state });
}

export async function addDeduction(page: Page, description: string, amount: string, category = "cleaning") {
  await page.getByLabel("Description", { exact: true }).fill(description);
  await page.getByLabel("Category").selectOption(category);
  await page.getByLabel("Amount ($)", { exact: true }).fill(amount);
  await page.getByRole("button", { name: "Add deduction" }).click();
}
