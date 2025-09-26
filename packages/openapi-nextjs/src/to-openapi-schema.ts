/* eslint-disable @typescript-eslint/no-explicit-any */

import type { OpenAPIV3_1 } from "@scalar/openapi-types";
import { toJsonSchema } from "@valibot/to-json-schema";
import type * as v from "valibot";

import type { OpenApiMetadata } from "./create-route-handler.ts";

export function toOpenApiPathParamsSchema<
	TEntries extends v.ObjectEntries,
	TMessage extends v.ErrorMessage<v.ObjectIssue> | undefined,
>(schema: v.ObjectSchema<TEntries, TMessage>): Array<OpenAPIV3_1.ParameterObject> {
	const params: Array<OpenAPIV3_1.ParameterObject> = [];

	const jsonSchema = toJsonSchema(schema, { errorMode: "warn", typeMode: "input" });
	delete jsonSchema.$schema;

	// @ts-expect-error It's fine.
	for (const [name, { description, ...property }] of Object.entries(jsonSchema.properties)) {
		params.push({
			name,
			in: "path",
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			description,
			required: Boolean(jsonSchema.required?.includes(name)),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			schema: property,
		});
	}

	return params;
}

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

export function toOpenApiRequestBodySchema<TInput, TOutput, TIssue extends v.BaseIssue<unknown>>(
	schema: v.BaseSchema<TInput, TOutput, TIssue>,
): OpenAPIV3_1.RequestBodyObject {
	const jsonSchema = toJsonSchema(schema, { errorMode: "warn", typeMode: "input" });
	delete jsonSchema.$schema;

	// @ts-expect-error It's fine.
	return jsonSchema;
}

export function toOpenApiResponseSchema<TInput, TOutput, TIssue extends v.BaseIssue<unknown>>(
	schema: v.BaseSchema<TInput, TOutput, TIssue>,
): OpenAPIV3_1.SchemaObject {
	const jsonSchema = toJsonSchema(schema, { errorMode: "warn", typeMode: "output" });
	delete jsonSchema.$schema;

	// @ts-expect-error It's fine.
	return jsonSchema;
}

export function toOpenApiResponsesSchema(
	input: Record<
		number,
		{
			description?: string;
			content: Record<string, { schema: v.BaseSchema<any, any, any> }>;
		}
	>,
): OpenAPIV3_1.ResponsesObject {
	const responses: OpenAPIV3_1.ResponsesObject = {};

	for (const [status, { content, ...response }] of Object.entries(input)) {
		const _content: OpenAPIV3_1.ResponseObject = {};

		for (const [type, { schema, ...def }] of Object.entries(content)) {
			_content[type] = { ...def, schema: toOpenApiResponseSchema(schema) };
		}

		responses[status] = { ...response, content: _content };
	}

	return responses;
}

interface Input {
	description?: string;
	summary?: string;
	params?: v.ObjectSchema<any, any>;
	searchParams?: v.ObjectSchema<any, any>;
	body?: v.BaseSchema<any, any, any>;
	responses: Record<
		number,
		{
			description?: string;
			content: Record<string, { schema: v.BaseSchema<any, any, any> }>;
		}
	>;
}

export function toOpenApiSchema(input: Input): OpenApiMetadata {
	return {
		description: input.description,
		summary: input.summary,
		params: input.params !== undefined ? toOpenApiPathParamsSchema(input.params) : undefined,
		searchParams:
			input.searchParams !== undefined
				? toOpenApiSearchParamsSchema(input.searchParams)
				: undefined,
		body: input.body !== undefined ? toOpenApiRequestBodySchema(input.body) : undefined,
		responses: toOpenApiResponsesSchema(input.responses),
	};
}
