import { IdGenerator } from "@thoth/core";
import { Conflict, ErrorCode, NotFound } from "@thoth/utils";
import { inject, injectable } from "inversify";
import type { Bio } from "../domain/bio";
import type { BioInputDTO } from "./bio.dto";
import { BioRepository, HandleTaken } from "./bio.repository";

@injectable()
export class BioService {
	constructor(
		@inject(BioRepository) private readonly repo: BioRepository,
		@inject(IdGenerator) private readonly ids: IdGenerator,
	) {}

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

	async create(userId: string, input: BioInputDTO): Promise<Bio> {
		try {
			const bio = await this.repo.insert(userId, {
				id: this.ids.next(),
				...input,
			});
			if (bio) return bio;
		} catch (err) {
			if (err instanceof HandleTaken) {
				throw new Conflict(
					ErrorCode.BIO_HANDLE_TAKEN,
					`Handle "${input.handle}" is already taken`,
				);
			}

			throw err;
		}

		throw new Conflict(
			ErrorCode.BIO_ALREADY_EXISTS,
			"You already have a bio. Update it instead.",
		);
	}

	async update(userId: string, input: BioInputDTO): Promise<Bio> {
		try {
			const bio = await this.repo.update(userId, input);
			if (bio) return bio;
		} catch (err) {
			if (err instanceof HandleTaken) {
				throw new Conflict(
					ErrorCode.BIO_HANDLE_TAKEN,
					`Handle "${input.handle}" is already taken`,
				);
			}

			throw err;
		}

		throw new NotFound(
			ErrorCode.BIO_NOT_FOUND,
			"You have no bio yet. Create it first.",
		);
	}
}
