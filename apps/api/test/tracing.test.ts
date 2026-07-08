import { beforeEach, describe, expect, it, vi } from "vitest";

const start = vi.fn();
const shutdown = vi.fn().mockResolvedValue(undefined);

vi.mock("@opentelemetry/sdk-node", () => ({
	NodeSDK: vi.fn(function NodeSDK() {
		return { start, shutdown };
	}),
}));

vi.mock("@opentelemetry/auto-instrumentations-node", () => ({
	getNodeAutoInstrumentations: vi.fn(() => []),
}));

describe("tracing", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("starts and shuts down the SDK when OTEL_ENABLED is true", async () => {
		vi.stubEnv("OTEL_ENABLED", "true");
		const { tracing } = await import("~/tracing");
		expect(start).toHaveBeenCalledOnce();

		await tracing.stop();
		expect(shutdown).toHaveBeenCalledOnce();
	});

	it("is a no-op when OTEL_ENABLED is false", async () => {
		vi.stubEnv("OTEL_ENABLED", "false");
		const { tracing } = await import("~/tracing");
		expect(start).not.toHaveBeenCalled();

		await tracing.stop();
		expect(shutdown).not.toHaveBeenCalled();
	});
});
