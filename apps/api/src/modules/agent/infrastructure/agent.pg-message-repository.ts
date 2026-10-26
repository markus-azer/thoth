import { inject, injectable } from "inversify";
import { Postgres } from "~/infrastructure/db/index";
import type { MessageRepository } from "../application/ports/index";
import { Message, type MessageRole } from "../domain/message";

type MessageRow = {
	id: string;
	threadId: string;
	role: MessageRole;
	content: string;
	createdAt: Date;
};

@injectable()
export class PostgresMessageRepository implements MessageRepository {
	constructor(@inject(Postgres) private readonly db: Postgres) {}

	async list(threadId: string): Promise<Message[]> {
		const rows = await this.db.query<MessageRow>(
			`SELECT id, thread_id AS "threadId", role, content, created_at AS "createdAt"
				FROM messages
				WHERE thread_id = $1
				ORDER BY id`,
			[threadId],
		);

		return rows.map((row) => new Message(row));
	}

	async add(message: Message): Promise<void> {
		await this.db.query(
			`INSERT INTO messages (id, thread_id, role, content, created_at)
				VALUES ($1, $2, $3, $4, $5)`,
			[
				message.id,
				message.threadId,
				message.role,
				message.content,
				message.createdAt,
			],
		);
	}
}
