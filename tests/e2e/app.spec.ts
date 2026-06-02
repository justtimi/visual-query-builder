import { test, expect } from "@playwright/test";

test("homepage loads and save query modal works", async ({ page }) => {
  await page.goto("/");

  const saveButton = page.getByRole("button", { name: "Save Query" });
  await expect(saveButton).toBeVisible();

  await saveButton.click();

  const dialogTitle = page.getByRole("heading", { name: "Save Query" });
  await expect(dialogTitle).toBeVisible();

  const input = page.getByPlaceholder("Enter query name...");
  await expect(input).toBeVisible();
  await input.fill("My Playwright Query");

  await page.getByRole("button", { name: "Save" }).click();
  await expect(dialogTitle).not.toBeVisible();

  await expect(page.getByText("Save Query")).toBeVisible();
});
