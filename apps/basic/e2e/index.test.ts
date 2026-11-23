import { expect, test } from "@playwright/test";

test("should display api docs", async ({ page }) => {
	const title = "Example API";

	await page.goto("/api-docs");

	await expect(page.getByRole("heading", { level: 1 })).toContainText(title);
});

test("should display endpoint definitions", async ({ page }) => {
	await page.goto("/api-docs");

	for (const endpoint of [
		"/api/resources/vegetables",
		"/api/resources/vegetables/{id}",
		"/api/resources/fruits",
		"/api/resources/fruits/{id}",
	]) {
		await page.getByRole("link", { name: `${endpoint} HTTP Method: GET`, exact: true }).click();
		await expect(page.getByRole("region", { name: endpoint, exact: true }).first()).toBeVisible();
	}
});
