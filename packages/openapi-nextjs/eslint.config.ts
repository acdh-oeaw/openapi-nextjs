import baseConfig from "@acdh-oeaw/eslint-config";
import nodeConfig from "@acdh-oeaw/eslint-config-node";
import { defineConfig } from "eslint/config";
import gitignore from "eslint-config-flat-gitignore";

export default defineConfig(gitignore({ strict: false }), baseConfig, nodeConfig, {
	rules: {
		"arrow-body-style": ["error", "always"],
		"@typescript-eslint/explicit-module-boundary-types": "error",
		"@typescript-eslint/require-array-sort-compare": "error",
		"@typescript-eslint/strict-boolean-expressions": "error",
	},
});
