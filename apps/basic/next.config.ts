import type { NextConfig as Config } from "next";

const config: Config = {
	typedRoutes: true,
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default config;
