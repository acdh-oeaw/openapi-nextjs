import * as path from "node:path";

import { log } from "@acdh-oeaw/lib";
import { generate as generateApiDocs } from "@acdh-oeaw/openapi-nextjs";

async function generate() {
	await generateApiDocs({
		directory: path.resolve("app"),
		info: {
			title: "Example API",
			version: "1.0.0",
			description: "Generated OpenAPI spec from Next.js app router endpoints.",
		},
		servers: [{ url: "http://localhost:3000", description: "Local development server" }],
	});
}

generate().catch((error: unknown) => {
	log.error("Failed to generate api docs.\n", error);
	process.exitCode = 1;
});
