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

interface Input<
	TPathParamsEntries extends v.ObjectEntries,
	TPathParamsMessage extends v.ErrorMessage<v.ObjectIssue> | undefined,
	TSearchParamsEntries extends v.ObjectEntries,
	TSearchParamsMessage extends v.ErrorMessage<v.ObjectIssue> | undefined,
	TRequestBodyInput,
	TRequestBodyOutput,
	TRequestBodyIssue extends v.BaseIssue<unknown>,
	TResponseInput,
	TResponseOutput,
	TResponseIssue extends v.BaseIssue<unknown>,
> {
	description?: string;
	summary?: string;
	params?: v.ObjectSchema<TPathParamsEntries, TPathParamsMessage>;
	searchParams?: v.ObjectSchema<TSearchParamsEntries, TSearchParamsMessage>;
	requestBody?: v.BaseSchema<TRequestBodyInput, TRequestBodyOutput, TRequestBodyIssue>;
	response: v.BaseSchema<TResponseInput, TResponseOutput, TResponseIssue>;
}

export function toOpenApiSchema<
	TPathParamsEntries extends v.ObjectEntries,
	TPathParamsMessage extends v.ErrorMessage<v.ObjectIssue> | undefined,
	TSearchParamsEntries extends v.ObjectEntries,
	TSearchParamsMessage extends v.ErrorMessage<v.ObjectIssue> | undefined,
	TRequestBodyInput,
	TRequestBodyOutput,
	TRequestBodyIssue extends v.BaseIssue<unknown>,
	TResponseInput,
	TResponseOutput,
	TResponseIssue extends v.BaseIssue<unknown>,
>(
	input: Input<
		TPathParamsEntries,
		TPathParamsMessage,
		TSearchParamsEntries,
		TSearchParamsMessage,
		TRequestBodyInput,
		TRequestBodyOutput,
		TRequestBodyIssue,
		TResponseInput,
		TResponseOutput,
		TResponseIssue
	>,
): OpenApiMetadata {
	return {
		description: input.description,
		summary: input.summary,
		params: input.params !== undefined ? toOpenApiPathParamsSchema(input.params) : undefined,
		searchParams:
			input.searchParams !== undefined
				? toOpenApiSearchParamsSchema(input.searchParams)
				: undefined,
		requestBody:
			input.requestBody !== undefined ? toOpenApiRequestBodySchema(input.requestBody) : undefined,
		response: toOpenApiResponseSchema(input.response),
	};
}
