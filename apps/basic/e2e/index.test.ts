import { expect, test } from "@playwright/test";

test("should display api docs", async ({ page }) => {
	const title = "Example API";

	await page.goto("/api-docs");

	await expect(page.getByRole("heading", { level: 1 })).toContainText(title);
});

test("should display endpoint definitions", async ({ page }) => {
	await page.goto("/api-docs");

	await expect(
		page.getByRole("region", { name: "/api/resources/vegetables" }).first(),
	).toBeVisible();
	await expect(
		page.getByRole("region", { name: "/api/resources/vegetables/{id}" }).first(),
	).toBeVisible();
	await expect(page.getByRole("region", { name: "/api/resources/fruits" }).first()).toBeVisible();
	await expect(
		page.getByRole("region", { name: "/api/resources/fruits/{id}" }).first(),
	).toBeVisible();
});
