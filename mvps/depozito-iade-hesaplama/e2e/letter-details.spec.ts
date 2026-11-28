import { expect, test } from "@playwright/test";
import { fillBasics, open } from "./helpers";

test("statement includes landlord return address and tenant forwarding address (Y7)", async ({ page }) => {
  await open(page);
  await page.getByLabel("Your name or company", { exact: true }).fill("Pat Lee Rentals");
  await page.getByLabel("Your mailing address", { exact: true }).fill("12 Oak Ave\nSacramento, CA 95814");
  await fillBasics(page, { tenant: "Robin Diaz", deposit: "1500", moveOut: "2026-11-01", state: "California" });
  await page.getByLabel("Tenant forwarding address", { exact: true }).fill("88 Pine Rd\nDavis, CA 95616");
  await page.getByRole("button", { name: "Save move-out" }).click();

  await page.reload();
  // landlord details are remembered across sessions and records
  await expect(page.getByLabel("Your name or company", { exact: true })).toHaveValue("Pat Lee Rentals");
  await page.getByRole("button", { name: "Edit Robin Diaz" }).click();
  await page.getByRole("button", { name: "Create statement" }).click();
  const letter = page.getByRole("article", { name: "Itemized security deposit statement" });
  for (const t of ["Pat Lee Rentals", "12 Oak Ave", "Sacramento, CA 95814", "88 Pine Rd", "Davis, CA 95616"]) {
    await expect(letter).toContainText(t);
  }
  await expect(page.getByText(/add the tenant's forwarding address/i)).toHaveCount(0);
});

test("statement warns when addresses are missing, Escape closes it, and focus moves into it (Y3)", async ({ page }) => {
  await open(page);
  await fillBasics(page, { tenant: "No Address", deposit: "1000", moveOut: "2026-11-01", state: "California" });
  await page.getByRole("button", { name: "Create statement" }).click();
  const dialog = page.getByRole("dialog", { name: "Statement preview" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/add the tenant's forwarding address/i)).toBeVisible();
  await expect(dialog.getByText(/add your name and mailing address/i)).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Print" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Create statement" })).toBeFocused();
});
