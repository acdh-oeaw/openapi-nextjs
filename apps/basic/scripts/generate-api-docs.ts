import * as fs from "node:fs/promises";
import * as path from "node:path";

import { log } from "@acdh-oeaw/lib";
import { generate as generateApiDocs } from "@acdh-oeaw/openapi-nextjs";

async function generate() {
	const openapiDoc = await generateApiDocs({
		directory: path.resolve("app"),
		info: {
			title: "Example API",
			version: "1.0.0",
			description: "Generated OpenAPI spec from Next.js app router endpoints.",
		},
		servers: [{ url: "http://localhost:3000", description: "Local development server" }],
	});

	const outputFolder = path.join(process.cwd(), "public");
	await fs.mkdir(outputFolder, { recursive: true });

	await fs.writeFile(path.join(outputFolder, "openapi.json"), JSON.stringify(openapiDoc, null, 2), {
		encoding: "utf-8",
	});
}

generate().catch((error: unknown) => {
	log.error("Failed to generate api docs.\n", error);
	process.exitCode = 1;
});
