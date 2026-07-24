import { inject, injectable } from "inversify";
import { Postgres } from "~/infrastructure/db/index";
import type { FeedbackRepository } from "../application/feedback.repository";
import type { Feedback } from "../domain/feedback";

@injectable()
export class PostgresFeedbackRepository implements FeedbackRepository {
	constructor(@inject(Postgres) private readonly db: Postgres) {}

	async save(f: Feedback): Promise<void> {
		await this.db.query(
			`INSERT INTO feedback (id, message, name, topic, email, created_at)
				VALUES ($1, $2, $3, $4, $5, $6)`,
			[f.id, f.message, f.name, f.topic, f.email, f.createdAt],
		);
	}
}
