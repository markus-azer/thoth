import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Lifecycle } from "~/lifecycle";
import { LifecycleManager } from "~/lifecycle";
import { log } from "~/logger";

type FakeOpts = {
	failStart?: boolean;
	failStop?: boolean;
	stopDelay?: number;
};

class FakeService implements Lifecycle {
	constructor(
		private readonly trace: string[],
		private readonly name: string,
		private readonly opts: FakeOpts = {},
	) {}

	async start(): Promise<void> {
		this.trace.push(`start:${this.name}`);
		if (this.opts.failStart) throw new Error(`${this.name} start failed`);
	}

	async stop(): Promise<void> {
		this.trace.push(`stop:${this.name}`);
		if (this.opts.stopDelay !== undefined) {
			await new Promise((r) => setTimeout(r, this.opts.stopDelay));
		}
		if (this.opts.failStop) throw new Error(`${this.name} stop failed`);
	}
}

const setup = () => {
	const trace: string[] = [];
	const manager = new LifecycleManager();
	const service = (name: string, opts?: FakeOpts) =>
		new FakeService(trace, name, opts);
	return { trace, manager, service };
};

describe("LifecycleManager", () => {
	it("RULE-LIFECYCLE-001: Services start in registration order", async () => {
		const { trace, manager, service } = setup();
		manager.register(service("a"));
		manager.register(service("b"));

		await manager.start();

		expect(trace).toEqual(["start:a", "start:b"]);
	});

	it("RULE-LIFECYCLE-002: Services stop in reverse registration order", async () => {
		const { trace, manager, service } = setup();
		manager.register(service("a"));
		manager.register(service("b"));

		await manager.start();
		await manager.stop();

		expect(trace).toEqual(["start:a", "start:b", "stop:b", "stop:a"]);
	});

	it("RULE-LIFECYCLE-003: On start failure, every already-started service is stopped in reverse order, then the original error is rethrown", async () => {
		const { trace, manager, service } = setup();
		manager.register(service("a"));
		manager.register(service("b", { failStart: true }));
		manager.register(service("c"));

		await expect(manager.start()).rejects.toThrow("b start failed");

		expect(trace).toEqual(["start:a", "start:b", "stop:a"]);
	});

	it("RULE-LIFECYCLE-005: If a service throws during stop, the manager logs and moves to the next", async () => {
		const { trace, manager, service } = setup();
		manager.register(service("a"));
		manager.register(service("b", { failStop: true }));
		manager.register(service("c"));

		await manager.start();
		await manager.stop();

		expect(trace).toEqual([
			"start:a",
			"start:b",
			"start:c",
			"stop:c",
			"stop:b",
			"stop:a",
		]);
	});

	it("RULE-LIFECYCLE-006: Calling stop twice runs the drain once", async () => {
		const { trace, manager, service } = setup();
		manager.register(service("a"));
		await manager.start();

		await manager.stop();
		await manager.stop();

		expect(trace).toEqual(["start:a", "stop:a"]);
	});

	it("RULE-LIFECYCLE-009: Unhandled rejection and uncaught exception log and exit non-zero", async () => {
		const exit = vi
			.spyOn(process, "exit")
			.mockImplementation(() => undefined as never);
		const error = vi.spyOn(log, "error").mockImplementation(() => {});

		const manager = new LifecycleManager();
		manager.trapFatals();

		process.emit("unhandledRejection", new Error("boom"), Promise.resolve());
		process.emit("uncaughtException", new Error("kaboom"));
		await vi.waitFor(() => expect(exit).toHaveBeenCalledTimes(2));

		expect(error).toHaveBeenCalledTimes(2);
		expect(exit).toHaveBeenCalledWith(1);

		vi.restoreAllMocks();
		process.removeAllListeners("unhandledRejection");
		process.removeAllListeners("uncaughtException");
	});

	describe("with fake timers", () => {
		beforeEach(() => {
			vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
		});
		afterEach(() => {
			vi.useRealTimers();
		});

		it("RULE-LIFECYCLE-004: Per-service `stop()` is wrapped in a timeout", async () => {
			const { trace, manager, service } = setup();
			manager.register(service("a"));
			manager.register(service("b", { stopDelay: 60_000 }));
			manager.register(service("c"));
			await manager.start();

			const stopping = manager.stop();
			await vi.advanceTimersByTimeAsync(11_000);
			await stopping;

			expect(trace).toEqual([
				"start:a",
				"start:b",
				"start:c",
				"stop:c",
				"stop:b",
				"stop:a",
			]);
		});

		it("RULE-LIFECYCLE-007: SIGTERM and SIGINT invoke stop and exit cleanly", async () => {
			const exitMock = vi
				.spyOn(process, "exit")
				.mockImplementation(() => undefined as never);

			const { trace, manager, service } = setup();
			manager.register(service("a"));
			await manager.start();
			manager.trapSignals();

			process.emit("SIGTERM");
			await vi.advanceTimersByTimeAsync(100);

			expect(trace).toContain("stop:a");
			expect(exitMock).toHaveBeenCalledWith(0);

			exitMock.mockRestore();
			process.removeAllListeners("SIGTERM");
			process.removeAllListeners("SIGINT");
		});

		it("RULE-LIFECYCLE-008: Repeat signals during shutdown are ignored", async () => {
			const exitMock = vi
				.spyOn(process, "exit")
				.mockImplementation(() => undefined as never);

			const { trace, manager, service } = setup();
			manager.register(service("a", { stopDelay: 1_000 }));
			await manager.start();
			manager.trapSignals();

			process.emit("SIGTERM");
			process.emit("SIGINT");
			await vi.advanceTimersByTimeAsync(2_000);

			expect(trace.filter((t) => t === "stop:a")).toHaveLength(1);
			expect(exitMock).toHaveBeenCalledTimes(1);

			exitMock.mockRestore();
			process.removeAllListeners("SIGTERM");
			process.removeAllListeners("SIGINT");
		});
	});
});
