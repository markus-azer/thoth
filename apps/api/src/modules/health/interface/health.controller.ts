import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { HealthService } from "../application/health.service";

@injectable()
export class HealthController {
	constructor(@inject(HealthService) private readonly service: HealthService) {}

	live = (_req: Request, res: Response): void => {
		res.json(this.service.live());
	};

	ready = async (_req: Request, res: Response): Promise<void> => {
		const result = await this.service.ready();
		res.status(result.status === "ok" ? 200 : 503).json(result);
	};
}
