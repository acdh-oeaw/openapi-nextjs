import { createRouteHandler, toOpenApiSchema } from "@acdh-oeaw/openapi-nextjs";
import * as v from "valibot";

import { items, itemSchema } from "@/data/vegetables";

const pathParamsSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty()),
});

const responseSchema = itemSchema;

export const GET = createRouteHandler(
	toOpenApiSchema({
		description: "Retrieves a vegetable resource by id.",
		response: responseSchema,
	}),
	(_request, context: RouteContext<"/api/resources/vegetables/[id]">) => {
		const params = v.parse(pathParamsSchema, context.params);

		const data = items.find((item) => {
			return item.id === params.id;
		});

		if (data == null) {
			return Response.json({ message: "Not found" }, { status: 404 });
		}

		const response = v.parse(responseSchema, data);

		return Response.json(response);
	},
);
