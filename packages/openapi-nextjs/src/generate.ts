import * as fs from "node:fs/promises";
import * as path from "node:path";

import type { OpenAPIV3_1 } from "@scalar/openapi-types";

import type { OpenApiMetadata } from "./create-route-handler.ts";

const methods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

const routeGroupPathSegmentRegEx = /^\(.+\)$/;
const dynamicPathSegmentRegEx = /^\[(.+)\]$/;

export interface GenerateOptions {
	directory: string;
	info: OpenAPIV3_1.InfoObject;
	servers: Array<OpenAPIV3_1.ServerObject>;
}

export async function generate(options: GenerateOptions): Promise<OpenAPIV3_1.Document> {
	const { directory, info, servers } = options;

	const paths: OpenAPIV3_1.PathsObject = {};

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	for await (const entry of fs.glob("**/route.ts", {
		cwd: directory,
		withFileTypes: true,
	})) {
		const filePath = path.join(entry.parentPath, entry.name);

		const exports = (await import(filePath)) as Record<string, unknown>;

		const apiPath = `/${path.posix
			.relative(directory, path.dirname(filePath))
			.split("/")
			.filter((segment) => {
				return !routeGroupPathSegmentRegEx.test(segment);
			})
			.map((segment) => {
				return segment.replace(dynamicPathSegmentRegEx, "{$1}");
			})
			.join("/")}`;

		for (const [name, handler] of Object.entries(exports)) {
			if (methods.has(name) && typeof handler === "function" && "openapi" in handler) {
				const method = name.toLowerCase() as OpenAPIV3_1.HttpMethods;
				const openapi = handler.openapi as OpenApiMetadata;

				paths[apiPath] ??= {};

				paths[apiPath][method] = {
					summary: openapi.summary,
					description: openapi.description,
					tags: openapi.tags,
					parameters: [...(openapi.params ?? []), ...(openapi.searchParams ?? [])],
					body: openapi.body,
					responses: openapi.responses,
				};
			}
		}
	}

	const openapiDoc: OpenAPIV3_1.Document = {
		openapi: "3.1.1",
		info,
		servers,
		paths,
	};

	return openapiDoc;
}
