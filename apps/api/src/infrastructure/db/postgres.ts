// TODO: extract to @thoth/postgres package since its common.
import { injectable } from "inversify";
import { Pool, type PoolClient, type QueryResultRow } from "pg";
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

	async ping(): Promise<boolean> {
		try {
			await this.pool.query("SELECT 1");
			return true;
		} catch {
			return false;
		}
	}

	async transaction<T>(fn: (tx: PoolClient) => Promise<T>): Promise<T> {
		const client = await this.pool.connect();
		try {
			await client.query("BEGIN");
			const result = await fn(client);
			await client.query("COMMIT");
			return result;
		} catch (err) {
			await client.query("ROLLBACK");
			throw err;
		} finally {
			client.release();
		}
	}
}
