import { ErrorCode, NotFound } from "@thoth/utils";
import { inject, injectable } from "inversify";
import type { Bio } from "../domain/bio";
import { BioRepository } from "./bio.repository";

// TODO: derive from the URL path (slug or UUID).
const TENANT = "markus";

@injectable()
export class BioService {
	constructor(@inject(BioRepository) private readonly repo: BioRepository) {}

	async get(): Promise<Bio> {
		const bio = await this.repo.get(TENANT);
		if (!bio) {
			throw new NotFound(
				ErrorCode.BIO_NOT_FOUND,
				`No bio found for tenant "${TENANT}"`,
			);
		}
		return bio;
	}
}
