import { defineConfig, devices } from "@playwright/test";
import isCI from "is-in-ci";

const port = Number(process.env.PORT) || 3000;
const baseUrl = `http://localhost:${String(port)}`;

export default defineConfig({
	testDir: "./e2e",
	snapshotDir: "./e2e/snapshots",
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	maxFailures: 10,
	workers: isCI ? 1 : undefined,
	reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["html"]],
	use: {
		baseURL: baseUrl,
		screenshot: "on-first-failure",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"], channel: "chromium" },
		},
	],
	webServer: {
		command: `pnpm run start --port ${String(port)}`,
		url: baseUrl,
		reuseExistingServer: !isCI,
	},
});
