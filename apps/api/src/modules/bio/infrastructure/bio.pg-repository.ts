import { inject, injectable } from "inversify";
import { isUniqueViolation, Postgres } from "~/infrastructure/db/index";
import {
	type BioFields,
	type BioRepository,
	HandleTaken,
	type NewBio,
} from "../application/bio.repository";
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
	// Named in V5__bio-handle.sql.
	private readonly handleConstraint = "bio_handle_key";

	private readonly columns = `
		id,
		user_id AS "userId",
		handle,
		name,
		headline,
		about,
		created_at AS "createdAt",
		updated_at AS "updatedAt"`;

	constructor(@inject(Postgres) private readonly db: Postgres) {}

	async findByHandle(handle: string): Promise<Bio | null> {
		const [row] = await this.db.query<BioRow>(
			`SELECT ${this.columns}
				FROM bio
				WHERE handle = $1`,
			[handle],
		);

		return row ? new Bio(row) : null;
	}

	async insert(userId: string, bio: NewBio): Promise<Bio | null> {
		const row = await this.write(
			`INSERT INTO bio (id, user_id, handle, name, headline, about, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, now(), now())
				ON CONFLICT (user_id) DO NOTHING
				RETURNING ${this.columns}`,
			[bio.id, userId, bio.handle, bio.name, bio.headline, bio.about],
		);

		return row ? new Bio(row) : null;
	}

	async update(userId: string, fields: BioFields): Promise<Bio | null> {
		const row = await this.write(
			`UPDATE bio
				SET handle = $2, name = $3, headline = $4, about = $5, updated_at = now()
				WHERE user_id = $1
				RETURNING ${this.columns}`,
			[userId, fields.handle, fields.name, fields.headline, fields.about],
		);

		return row ? new Bio(row) : null;
	}

	private async write(
		sql: string,
		values: unknown[],
	): Promise<BioRow | undefined> {
		try {
			const [row] = await this.db.query<BioRow>(sql, values);
			return row;
		} catch (err) {
			if (isUniqueViolation(err, this.handleConstraint)) {
				throw new HandleTaken();
			}

			throw err;
		}
	}
}
