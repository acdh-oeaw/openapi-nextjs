import {
	createRouteHandler,
	toOpenApiResponseSchema,
	toOpenApiSearchParamsSchema,
} from "@acdh-oeaw/openapi-nextjs";
import * as v from "valibot";

const items = [
	{ id: "carrot", name: "Carrot" },
	{ id: "broccoli", name: "Broccoli" },
	{ id: "spinach", name: "Spinach" },
	{ id: "potato", name: "Potato" },
	{ id: "tomato", name: "Tomato" },
	{ id: "cucumber", name: "Cucumber" },
	{ id: "lettuce", name: "Lettuce" },
	{ id: "onion", name: "Onion" },
	{ id: "pepper", name: "Pepper" },
	{ id: "eggplant", name: "Eggplant" },
];

const itemSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty()),
	name: v.pipe(v.string(), v.nonEmpty()),
});

const responseSchema = v.object({
	total: v.pipe(v.number(), v.integer(), v.minValue(0)),
	items: v.array(itemSchema),
});

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

export const GET = createRouteHandler(
	{
		description: "Retrieves a paginated list of vegetable resources.",
		searchParams: toOpenApiSearchParamsSchema(searchParamsSchema),
		response: toOpenApiResponseSchema(responseSchema),
	},
	(request, _context: RouteContext<"/api/resources/vegetables">) => {
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
