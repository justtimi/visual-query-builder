import { test, expect } from "@playwright/test";

test("full query save, execute, history, and delete flow", async ({ page }) => {
  await page.goto("/");

  // Save a query
  await page.getByRole("button", { name: "Save Query" }).click();
  const dialogTitle = page.locator('[data-slot="dialog-title"]');
  await expect(dialogTitle).toHaveText("Save Query");

  const input = page.getByPlaceholder("Enter query name...");
  await expect(input).toBeVisible();
  await input.fill("My Playwright Query");

  await page.getByRole("button", { name: "Save" }).click();
  await expect(dialogTitle).not.toBeVisible();

  const savedQueryButton = page.getByRole("button", {
    name: "My Playwright Query",
  });
  await expect(savedQueryButton).toBeVisible();

  // Execute the query in Results
  await page.getByRole("tab", { name: "Results" }).click();
  const executeButton = page.getByRole("button", { name: "Execute Query" });
  await expect(executeButton).toBeVisible();
  await executeButton.click();

  await expect(page.getByText(/result[s]? found/)).toBeVisible();
  await expect(page.getByText("Alice")).toBeVisible();

  // Verify history entry is created
  const historyButton = page.getByRole("button", { name: /^Run / });
  await expect(historyButton).toBeVisible();

  // Run from history to verify load + execution path
  await historyButton.click();
  await expect(page.getByText(/result[s]? found/)).toBeVisible();

  // Delete the saved query and confirm history removal
  await page
    .getByRole("button", { name: "Delete saved query My Playwright Query" })
    .click();
  await page.getByRole("button", { name: "Delete" }).click();

  await expect(
    page.getByRole("button", { name: "My Playwright Query" }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Run / })).toHaveCount(0);
});
