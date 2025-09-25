import type { OpenAPIV3_1 } from "@scalar/openapi-types";
import type { NextRequest } from "next/server.js";

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
