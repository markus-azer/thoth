import { inject, injectable } from "inversify";
import { type PoolClient, Postgres } from "~/infrastructure/db/index";
import { log } from "~/logger";
import type { QueryRunner, Row } from "../application/query.runner";

@injectable()
export class PostgresQueryRunner implements QueryRunner {
	constructor(@inject(Postgres) private readonly db: Postgres) {}

	async run(userId: string, sql: string): Promise<Row[]> {
		const client = await this.db.pool.connect();

		try {
			await this.beginAsOwner(client, userId);

			// The extended protocol rejects more than one statement.
			const result = await client.query<Row>({
				text: sql,
				queryMode: "extended",
			});

			return result.rows;
		} finally {
			await this.release(client);
		}
	}

	private async beginAsOwner(client: PoolClient, userId: string) {
		// `true` makes each setting last until ROLLBACK.
		// Switch the role last. llm_reader may not call set_config.
		const setup = `
			SELECT
				set_config('app.user_id', $1, true),
				set_config('statement_timeout', '1s', true),
				set_config('role', 'llm_reader', true)`;

		await client.query("BEGIN READ ONLY");
		await client.query(setup, [userId]);
	}

	// Always roll back, so nothing the query did survives.
	private async release(client: PoolClient) {
		try {
			await client.query("ROLLBACK");
			client.release();
		} catch (err) {
			log.error("rollback failed", { err });
			client.release(true);
		}
	}
}
