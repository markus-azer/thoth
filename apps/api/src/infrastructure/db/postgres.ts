// TODO: extract to @wadjet/postgres package since its common.
import { injectable } from "inversify";
import { Pool, type QueryResultRow } from "pg";
import { env } from "~/env";
import type { Lifecycle } from "~/lifecycle/index";

@injectable()
export class Postgres implements Lifecycle {
	private readonly pool = new Pool({ connectionString: env.DATABASE_URL });

	async start(): Promise<void> {
		await this.pool.query("SELECT 1");
	}

	async stop(): Promise<void> {
		await this.pool.end();
	}

	async query<T extends QueryResultRow>(
		sql: string,
		params?: unknown[],
	): Promise<T[]> {
		const result = await this.pool.query<T>(sql, params);
		return result.rows;
	}
}
