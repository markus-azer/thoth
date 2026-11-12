import { inject, injectable } from "inversify";
import { BioService } from "~/modules/bio/index";
import type { OwnerRepository } from "../application/owner.repository";

@injectable()
export class BioOwnerRepository implements OwnerRepository {
	constructor(@inject(BioService) private readonly bios: BioService) {}

	async getUserIdByHandle(handle: string): Promise<string> {
		const { userId } = await this.bios.get(handle);

		return userId;
	}
}
