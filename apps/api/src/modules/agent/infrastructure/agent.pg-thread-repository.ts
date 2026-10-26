import { inject, injectable } from "inversify";
import { Postgres } from "~/infrastructure/db/index";
import type { ThreadRepository } from "../application/ports/index";
import { Thread } from "../domain/thread";

type ThreadRow = {
	id: string;
	bioId: string;
	createdAt: Date;
};

@injectable()
export class PostgresThreadRepository implements ThreadRepository {
	constructor(@inject(Postgres) private readonly db: Postgres) {}

	async find(id: string): Promise<Thread | null> {
		const [row] = await this.db.query<ThreadRow>(
			`SELECT id, bio_id AS "bioId", created_at AS "createdAt"
				FROM threads
				WHERE id = $1`,
			[id],
		);

		return row ? new Thread(row) : null;
	}

	async add(thread: Thread): Promise<void> {
		await this.db.query(
			`INSERT INTO threads (id, bio_id, created_at)
				VALUES ($1, $2, $3)`,
			[thread.id, thread.bioId, thread.createdAt],
		);
	}
}
