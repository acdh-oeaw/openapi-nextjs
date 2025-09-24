import type { NextConfig as Config } from "next";

const config: Config = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typedRoutes: true,
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default config;
