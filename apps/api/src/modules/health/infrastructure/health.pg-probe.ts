import { inject, injectable } from "inversify";
import { Postgres } from "~/infrastructure/db/index";
import type { DbProbe } from "../application/health.probe";

@injectable()
export class PostgresDbProbe implements DbProbe {
	constructor(@inject(Postgres) private readonly db: Postgres) {}

	ping(): Promise<boolean> {
		return this.db.ping();
	}
}
