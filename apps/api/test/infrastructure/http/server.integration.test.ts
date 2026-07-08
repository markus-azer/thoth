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
});
