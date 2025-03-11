import { expect, test } from "@playwright/test";

test("should create a session successfully", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("textbox", { name: "Session Name" }).fill("Session");
  await page
    .getByRole("textbox", { name: "Session Description (optional)" })
    .fill("new Session");
  await page.getByPlaceholder("Your Name").nth(1).fill("playwrightTester");
  await page.getByRole("button", { name: "Create Session" }).click();
  await expect(page.getByText("new Session").nth(0)).toBeVisible();
});
