import pinoPretty from "pino-pretty";
import { describe, expect, it, vi } from "vitest";
import { createLogger } from "../src/logger";

vi.mock("pino-pretty", async () => {
	const actual = await vi.importActual<{
		default: typeof import("pino-pretty");
	}>("pino-pretty");
	return { default: vi.fn(actual.default) };
});

const captureStdout = () => {
	const writes: string[] = [];
	const spy = vi.spyOn(process.stdout, "write").mockImplementation(((
		chunk: unknown,
	) => {
		writes.push(String(chunk));
		return true;
	}) as typeof process.stdout.write);
	return { writes, restore: () => spy.mockRestore() };
};

describe("createLogger", () => {
	it("RULE-LOGGER-001: Output is JSON by default", async () => {
		const cap = captureStdout();
		const { log } = createLogger({ level: "info" });
		log.info("hello", { user: "alice" });
		await log.flush();
		cap.restore();

		const parsed = JSON.parse(cap.writes.join("").trim());
		expect(parsed.msg).toBe("hello");
		expect(parsed.user).toBe("alice");
	});

	it("RULE-LOGGER-002: When `opts.prettyPrint` is true, output is pretty via `pino-pretty`", () => {
		const spy = vi.mocked(pinoPretty);
		spy.mockClear();
		createLogger({ level: "silent", prettyPrint: true });
		expect(spy).toHaveBeenCalled();
	});

	it("RULE-LOGGER-003: `pinoInstance` is returned alongside `log` for middleware like `pino-http`", () => {
		const { log, pinoInstance } = createLogger({ level: "silent" });
		expect(log).toBeDefined();
		expect(pinoInstance).toBeDefined();
		expect(typeof pinoInstance.info).toBe("function");
	});

	it("RULE-LOGGER-004: `flush()` returns a promise that resolves when pino's buffer drains", async () => {
		const { log } = createLogger({ level: "silent" });
		const promise = log.flush();
		expect(promise).toBeInstanceOf(Promise);
		await expect(promise).resolves.toBeUndefined();
	});

	it("log methods accept message and context without throwing", () => {
		const { log } = createLogger({ level: "silent" });
		expect(() => log.info("hello", { user: "alice" })).not.toThrow();
		expect(() => log.error("boom", { err: new Error("x") })).not.toThrow();
	});
});
