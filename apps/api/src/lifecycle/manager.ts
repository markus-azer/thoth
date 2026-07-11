import { withTimeout } from "@thoth/utils";
import { log } from "~/logger";
import type { Lifecycle } from "./lifecycle";

const STOP_TIMEOUT_MS = 10_000;

export class LifecycleManager {
	private readonly services: Lifecycle[] = [];
	// What's currently running. Drives LIFO stop and partial-start rollback.
	private readonly started: Lifecycle[] = [];
	private shuttingDown = false;

	register(service: Lifecycle): void {
		this.services.push(service);
	}

	trapSignals(): void {
		const shutdown = async (signal: string) => {
			if (this.shuttingDown) return;
			this.shuttingDown = true;

			log.info("shutting down", { signal });
			await this.stop();
			log.info("shutdown complete");
			await log.flush();
			process.exit(0);
		};

		process.on("SIGTERM", () => void shutdown("SIGTERM"));
		process.on("SIGINT", () => void shutdown("SIGINT"));
	}

	// Last-resort trap for escaped errors. Node won't await this, that's fine.
	trapFatals(): void {
		const fatal = (kind: string) => async (err: unknown) => {
			log.error("fatal", { kind, err });
			await log.flush();
			process.exit(1);
		};
		process.on("unhandledRejection", fatal("unhandled rejection"));
		process.on("uncaughtException", fatal("uncaught exception"));
	}

	async start(): Promise<void> {
		try {
			for (const service of this.services) {
				await service.start();
				this.started.push(service);
				log.info("service started", { service: service.constructor.name });
			}
		} catch (err) {
			log.error("startup failed, rolling back");
			await this.stop();
			throw err;
		}
	}

	// LIFO drain. Swallow errors so one failure doesn't strand later services.
	async stop(): Promise<void> {
		for (const service of this.started.splice(0).reverse()) {
			try {
				await withTimeout(service.stop(), STOP_TIMEOUT_MS, "service stop");
				log.info("service stopped", { service: service.constructor.name });
			} catch (err) {
				log.error("failed to stop service", {
					err,
					service: service.constructor.name,
				});
			}
		}
	}
}
