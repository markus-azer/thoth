import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { BioOutputDTO } from "../application/bio.dto";
import { BioService } from "../application/bio.service";

@injectable()
export class BioController {
	constructor(@inject(BioService) private readonly service: BioService) {}

	get = async (
		req: Request<{ handle: string }>,
		res: Response,
	): Promise<void> => {
		const { name, headline, about } = await this.service.get(req.params.handle);
		const body: BioOutputDTO = { name, headline, about };
		res.json(body);
	};
}
