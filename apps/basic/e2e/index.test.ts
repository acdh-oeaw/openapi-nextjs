import { expect, test } from "@playwright/test";

test("should display api docs", async ({ page }) => {
	const title = "Example API";

	await page.goto("/api-docs");

	await expect(page.getByRole("heading", { level: 1 })).toContainText(title);
});
