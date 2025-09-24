import { resolve } from "node:path";

import baseConfig from "@acdh-oeaw/eslint-config";
import nextConfig from "@acdh-oeaw/eslint-config-next";
import nodeConfig from "@acdh-oeaw/eslint-config-node";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import reactConfig from "@acdh-oeaw/eslint-config-react";
import tailwindConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import { defineConfig } from "eslint/config";
import gitignore from "eslint-config-flat-gitignore";

export default defineConfig(
	gitignore({ strict: false }),
	{ ignores: ["content/**", "public/**"] },
	baseConfig,
	reactConfig,
	nextConfig,
	tailwindConfig,
	{
		settings: {
			tailwindcss: {
				config: resolve("./styles/index.css"),
			},
		},
	},
	playwrightConfig,
	{
		rules: {
			"arrow-body-style": ["error", "always"],
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/require-array-sort-compare": "error",
			"@typescript-eslint/strict-boolean-expressions": "error",
			"react/jsx-sort-props": ["error", { reservedFirst: true }],
			"react-x/prefer-read-only-props": "error",
		},
	},
	{
		files: ["scripts/**/*.ts"],
		extends: [nodeConfig],
	},
);
