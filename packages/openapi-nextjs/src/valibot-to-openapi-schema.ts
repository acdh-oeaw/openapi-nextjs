import type { OpenAPIV3_1 } from "@scalar/openapi-types";
import { toJsonSchema } from "@valibot/to-json-schema";
import type * as v from "valibot";

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
