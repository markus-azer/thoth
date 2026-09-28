import { inject, injectable } from "inversify";
import { Postgres } from "~/infrastructure/db/index";
import type { BioRepository } from "../application/bio.repository";
import { Bio } from "../domain/bio";

type BioRow = {
	id: string;
	userId: string;
	handle: string;
	name: string;
	headline: string;
	about: string;
	createdAt: Date;
	updatedAt: Date;
};

@injectable()
export class PostgresBioRepository implements BioRepository {
	constructor(@inject(Postgres) private readonly db: Postgres) {}

	async findByHandle(handle: string): Promise<Bio | null> {
		const [row] = await this.db.query<BioRow>(
			`SELECT id, user_id AS "userId", handle, name, headline, about,
				created_at AS "createdAt", updated_at AS "updatedAt"
				FROM bio
				WHERE handle = $1`,
			[handle],
		);

		return row ? new Bio(row) : null;
	}
}
