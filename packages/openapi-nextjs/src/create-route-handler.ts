import type { OpenAPIV3_1 } from "@scalar/openapi-types";
import { toJsonSchema } from "@valibot/to-json-schema";
import type { NextRequest } from "next/server.js";
import type * as v from "valibot";

type MaybePromise<T> = T | Promise<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NextRouteHandler = (request: NextRequest, context: any) => MaybePromise<Response>;

export interface OpenApiMetadata {
	description?: string;
	summary?: string;
	params?: Array<OpenAPIV3_1.ParameterObject>;
	searchParams?: Array<OpenAPIV3_1.ParameterObject>;
	requestBody?: OpenAPIV3_1.RequestBodyObject;
	response: OpenAPIV3_1.SchemaObject;
}

export type OpenApiNextRouteHandler<TOpenApiMetadata extends OpenApiMetadata> = NextRouteHandler & {
	openapi: TOpenApiMetadata;
};

export function createRouteHandler<TOpenApiMetadata extends OpenApiMetadata>(
	openapi: TOpenApiMetadata,
	handler: NextRouteHandler,
): OpenApiNextRouteHandler<TOpenApiMetadata> {
	const _handler = handler as OpenApiNextRouteHandler<TOpenApiMetadata>;
	_handler.openapi = openapi;
	return _handler;
}

//

export function toOpenApiSearchParamsSchema<
	TEntries extends v.ObjectEntries,
	TMessage extends v.ErrorMessage<v.ObjectIssue> | undefined,
>(schema: v.ObjectSchema<TEntries, TMessage>): Array<OpenAPIV3_1.ParameterObject> {
	const searchParams: Array<OpenAPIV3_1.ParameterObject> = [];

	const jsonSchema = toJsonSchema(schema, { errorMode: "warn", typeMode: "input" });
	delete jsonSchema.$schema;

	// @ts-expect-error It's fine.
	for (const [name, { description, ...property }] of Object.entries(jsonSchema.properties)) {
		searchParams.push({
			name,
			in: "query",
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			description,
			required: Boolean(jsonSchema.required?.includes(name)),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			schema: property,
		});
	}

	return searchParams;
}

export function toOpenApiResponseSchema<TInput, TOutput, TIssue extends v.BaseIssue<unknown>>(
	schema: v.BaseSchema<TInput, TOutput, TIssue>,
): OpenAPIV3_1.SchemaObject {
	const jsonSchema = toJsonSchema(schema, { errorMode: "warn", typeMode: "output" });
	delete jsonSchema.$schema;

	// @ts-expect-error It's fine.
	return jsonSchema;
}
