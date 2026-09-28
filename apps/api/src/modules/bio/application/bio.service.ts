import { ErrorCode, NotFound } from "@thoth/utils";
import { inject, injectable } from "inversify";
import type { Bio } from "../domain/bio";
import { BioRepository } from "./bio.repository";

@injectable()
export class BioService {
	constructor(@inject(BioRepository) private readonly repo: BioRepository) {}

	async get(handle: string | undefined): Promise<Bio> {
		if (!handle) {
			throw new NotFound(ErrorCode.BIO_NOT_FOUND, "No handle given");
		}

		const bio = await this.repo.findByHandle(handle);
		if (bio) return bio;

		throw new NotFound(
			ErrorCode.BIO_NOT_FOUND,
			`No bio found for handle "${handle}"`,
		);
	}
}
