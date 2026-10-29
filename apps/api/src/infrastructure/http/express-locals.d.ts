import type { McpPrincipal } from "~/infrastructure/mcp/index";

declare global {
	namespace Express {
		interface Locals {
			principal?: McpPrincipal;
		}
	}
}
