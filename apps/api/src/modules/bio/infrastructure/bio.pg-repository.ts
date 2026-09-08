import { inject, injectable } from "inversify";
import { Postgres } from "~/infrastructure/db/index";
import type { BioRepository } from "../application/bio.repository";
import { Bio } from "../domain/bio";

type BioRow = {
	id: string;
	tenant: string;
	name: string;
	headline: string;
	about: string;
	createdAt: Date;
	updatedAt: Date;
};

@injectable()
export class PostgresBioRepository implements BioRepository {
	constructor(@inject(Postgres) private readonly db: Postgres) {}

	async get(tenant: string): Promise<Bio | null> {
		const [bioRow] = await this.db.query<BioRow>(
			`SELECT id, tenant, name, headline, about, created_at AS "createdAt", updated_at AS "updatedAt"
				FROM bio
				WHERE tenant = $1`,
			[tenant],
		);
		if (!bioRow) return null;

		return new Bio({
			id: bioRow.id,
			tenant: bioRow.tenant,
			name: bioRow.name,
			headline: bioRow.headline,
			about: bioRow.about,
			createdAt: bioRow.createdAt,
			updatedAt: bioRow.updatedAt,
		});
	}
}
