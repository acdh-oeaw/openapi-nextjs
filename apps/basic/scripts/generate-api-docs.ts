import * as fs from "node:fs/promises";
import * as path from "node:path";

import { log } from "@acdh-oeaw/lib";
import { generate as generateApiDocs } from "@acdh-oeaw/openapi-nextjs";

const formatters = {
	duration: new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

async function generate() {
	const start = performance.now();

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

	const end = performance.now();
	const duration = formatters.duration.format(end - start);
	const stats = { duration };

	log.success(`Successfully generated api docs in ${stats.duration} ms.`);
}

generate().catch((error: unknown) => {
	log.error("Failed to generate api docs.\n", error);
	process.exitCode = 1;
});
