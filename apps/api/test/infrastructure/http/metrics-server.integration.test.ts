import "reflect-metadata";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { env } from "~/env";
import { MetricsServer } from "~/infrastructure/http/metrics-server";

const server = new MetricsServer();
const base = `http://localhost:${env.METRICS_PORT}`;

describe("MetricsServer", () => {
	beforeAll(async () => {
		await server.start();
	});

	afterAll(async () => {
		await server.stop();
	});

	it("serves /metrics as Prometheus text", async () => {
		const res = await request(base).get("/metrics");
		expect(res.status).toBe(200);
		expect(res.headers["content-type"]).toContain("text/plain");
	});

	it("serves /health/live with status ok", async () => {
		const res = await request(base).get("/health/live");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ status: "ok" });
	});
});
