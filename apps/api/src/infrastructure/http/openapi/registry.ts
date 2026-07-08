import {
	OpenAPIRegistry,
	OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();

export type OpenApiDocument = ReturnType<
	OpenApiGeneratorV31["generateDocument"]
>;

export function generateOpenApiDocument(): OpenApiDocument {
	const generator = new OpenApiGeneratorV31(registry.definitions);
	return generator.generateDocument({
		openapi: "3.1.0",
		info: {
			title: "@wadjet/api",
			// TODO: derive version from git tag or commit hash
			version: "0.0.0",
		},
		servers: [{ url: "/" }],
	});
}
