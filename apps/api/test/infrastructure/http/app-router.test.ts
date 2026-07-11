import "reflect-metadata";
import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createContainer } from "~/di/index";
import { AppRouter } from "~/infrastructure/http/index";

vi.mock("~/env", async (importOriginal) => {
	const actual = await importOriginal<typeof import("~/env")>();
	return { env: { ...actual.env, isProd: true } };
});

describe("AppRouter", () => {
	it("RULE-OAS-003: both routes are hidden when env.isProd is true", async () => {
		const app = express();
		const container = await createContainer();
		container.get(AppRouter).mount(app);
		const json = await request(app).get("/openapi.json");
		const docs = await request(app).get("/docs/");
		expect(json.status).toBe(404);
		expect(docs.status).toBe(404);
	});
});
