import { inject, injectable } from "inversify";
import { BioService } from "~/modules/bio/index";
import type { Profile, ProfileRepository } from "../application/ports/index";

@injectable()
export class BioProfileRepository implements ProfileRepository {
	constructor(@inject(BioService) private readonly bios: BioService) {}

	async getByHandle(handle: string): Promise<Profile> {
		const { id, name, headline, about } = await this.bios.get(handle);

		return { id, handle, name, headline, about };
	}

	async getById(id: string): Promise<Profile> {
		const { handle, name, headline, about } = await this.bios.getById(id);

		return { id, handle, name, headline, about };
	}
}
