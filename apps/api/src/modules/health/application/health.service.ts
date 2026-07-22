import { inject, injectable } from "inversify";
import type { Lifecycle } from "~/lifecycle/index";
import type { LiveStatus, ReadyStatus, Status } from "../domain/health";
import { DbProbe } from "./health.probe";

@injectable()
export class HealthService implements Lifecycle {
	private isReady = false;

	constructor(@inject(DbProbe) private readonly db: DbProbe) {}

	// Manual override for drain and backpressure.
	setReady(value: boolean): void {
		this.isReady = value;
	}

	async start(): Promise<void> {
		this.isReady = true;
	}

	async stop(): Promise<void> {
		this.isReady = false;
	}

	live(): LiveStatus {
		return { status: "ok" };
	}

	async ready(): Promise<ReadyStatus> {
		const dbUp = await this.db.ping();
		const db: Status = dbUp ? "ok" : "degraded";
		const status: Status = this.isReady && dbUp ? "ok" : "degraded";
		return { status, checks: { db } };
	}
}
