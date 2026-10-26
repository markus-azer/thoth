import { parseInput } from "@thoth/utils";
import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import {
	AskInputSchema,
	CreateThreadInputSchema,
} from "../application/agent.dto";
import { AgentService } from "../application/agent.service";
import type { ReplyOutputDTO, ThreadOutputDTO } from "./agent.dto";

@injectable()
export class AgentController {
	constructor(@inject(AgentService) private readonly service: AgentService) {}

	createThread = async (req: Request, res: Response): Promise<void> => {
		const input = parseInput(CreateThreadInputSchema, req.body);

		const { id } = await this.service.createThread(input);

		const body: ThreadOutputDTO = { id };

		res.status(201).json(body);
	};

	ask = async (
		req: Request<{ threadId: string }>,
		res: Response,
	): Promise<void> => {
		const input = parseInput(AskInputSchema, {
			threadId: req.params.threadId,
			message: req.body?.message,
		});

		const reply = await this.service.ask(input);

		const body: ReplyOutputDTO = { reply };

		res.json(body);
	};
}
