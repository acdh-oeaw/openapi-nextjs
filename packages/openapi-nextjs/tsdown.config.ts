import { defineConfig } from "tsdown";

export default defineConfig({
	attw: true,
	clean: true,
	dts: true,
	entry: "./src/index.ts",
	format: ["esm"],
	minify: false,
	sourcemap: true,
	treeshake: true,
	tsconfig: "./tsconfig.build.json",
});
