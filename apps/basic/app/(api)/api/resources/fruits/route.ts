import { createRouteHandler, toOpenApiSchema } from "@acdh-oeaw/openapi-nextjs";
import * as v from "valibot";

import { items, itemSchema } from "@/data/fruits";

const searchParamsSchema = v.object({
	limit: v.nullish(
		v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.minValue(1),
			v.maxValue(100),
			v.description("Maximum number of items to return."),
		),
		"10",
	),
	offset: v.nullish(
		v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.minValue(0),
			v.description("Number of items to skip before starting to collect the result set."),
		),
		"0",
	),
});

const responseSchema = v.object({
	total: v.pipe(v.number(), v.integer(), v.minValue(0)),
	items: v.array(itemSchema),
});

export const GET = createRouteHandler(
	toOpenApiSchema({
		description: "Retrieves a paginated list of fruit resources.",
		searchParams: searchParamsSchema,
		response: responseSchema,
	}),
	(request, _context: RouteContext<"/api/resources/fruits">) => {
		const url = new URL(request.url);

		const searchParams = v.parse(searchParamsSchema, {
			limit: url.searchParams.get("limit"),
			offset: url.searchParams.get("offset"),
		});

		const data = items.slice(searchParams.offset, searchParams.offset + searchParams.limit);

		const response = v.parse(responseSchema, {
			total: data.length,
			items: data,
		});

		return Response.json(response);
	},
);
