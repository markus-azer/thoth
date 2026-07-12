import "reflect-metadata";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createContainer } from "~/di/index";
import { env } from "~/env";
import { McpTool } from "~/infrastructure/http/index";
import { HttpServer } from "~/infrastructure/http/server";

const container = await createContainer();
// Bind a dummy tool through the DI to prove tools/list end-to-end.
const testTool: McpTool = {
	register: (mcp) => {
		mcp.registerTool(
			"test-ping",
			{ description: "integration test tool" },
			() => ({ content: [{ type: "text", text: "pong" }] }),
		);
	},
};
container.bind(McpTool).toConstantValue(testTool);
const server = container.get(HttpServer);
const base = `http://localhost:${env.PORT}`;

describe("HttpServer", () => {
	beforeAll(async () => {
		await server.start();
	});

	afterAll(async () => {
		await server.stop();
	});

	it("serves the welcome route on /", async () => {
		const res = await request(base).get("/");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ name: "@thoth/api", status: "ok" });
	});

	it("echoes x-request-id back on the response", async () => {
		const res = await request(base)
			.get("/")
			.set("x-request-id", "test-request-42");
		expect(res.headers["x-request-id"]).toBe("test-request-42");
	});

	it("generates x-request-id when client does not send one", async () => {
		const res = await request(base).get("/");
		expect(res.headers["x-request-id"]).toMatch(/^[A-Za-z0-9_-]{1,128}$/);
	});

	it("RULE-OAS-001: serves the OpenAPI document at /openapi.json", async () => {
		const res = await request(base).get("/openapi.json");
		expect(res.status).toBe(200);
		expect(res.body.openapi).toBe("3.1.0");
	});

	it("RULE-OAS-002: serves Swagger UI at /docs", async () => {
		const res = await request(base).get("/docs/").redirects(1);
		expect(res.status).toBe(200);
		expect(res.text).toContain("swagger-ui");
	});

	it('RULE-HEALTH-001: `/health/live` returns 200 with `{ status: "ok" }`', async () => {
		const res = await request(base).get("/health/live");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ status: "ok" });
	});

	it('RULE-HEALTH-003: `/health/ready` returns 503 with `status: "degraded"` before `start()`', async () => {
		const res = await request(base).get("/health/ready");
		expect(res.status).toBe(503);
		expect(res.body.status).toBe("degraded");
	});

	describe("MCP", () => {
		// Streamable HTTP requires the client to accept both JSON and SSE.
		const accept = "application/json, text/event-stream";
		const initialize = {
			jsonrpc: "2.0",
			id: 1,
			method: "initialize",
			params: {
				protocolVersion: "2024-11-05",
				capabilities: {},
				clientInfo: { name: "test", version: "1.0" },
			},
		};

		it("RULE-MCP-001: Mounts at `POST /mcp`", async () => {
			const res = await request(base)
				.post("/mcp")
				.set("Accept", accept)
				.send(initialize);

			expect(res.status).toBe(200);
		});

		it("RULE-MCP-002: Transport is MCP streamable HTTP", async () => {
			const res = await request(base)
				.post("/mcp")
				.set("Accept", accept)
				.send(initialize);

			expect(res.body.jsonrpc).toBe("2.0");
			expect(res.body.result.protocolVersion).toBeDefined();
			expect(res.body.result.serverInfo.name).toBe("@thoth/api");
		});

		it("RULE-MCP-003: No authentication required", async () => {
			const res = await request(base)
				.post("/mcp")
				.set("Accept", accept)
				.send(initialize);

			expect(res.status).toBe(200);
		});

		it("lists registered tools via tools/list", async () => {
			const res = await request(base)
				.post("/mcp")
				.set("Accept", accept)
				.send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
			const names = res.body.result.tools.map((t: { name: string }) => t.name);

			expect(res.status).toBe(200);
			expect(names).toContain("test-ping");
		});
	});
});
