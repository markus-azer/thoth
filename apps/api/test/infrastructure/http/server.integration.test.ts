import "reflect-metadata";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createContainer } from "~/di/index";
import { env } from "~/env";
import { HttpServer } from "~/infrastructure/http/server";

const container = await createContainer();
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
		expect(res.body).toEqual({ name: "@wadjet/api", status: "ok" });
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
});
