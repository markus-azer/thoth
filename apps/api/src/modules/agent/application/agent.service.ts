import { IdGenerator } from "@thoth/core";
import { ErrorCode } from "@thoth/utils/error-codes";
import { AppError, NotFound } from "@thoth/utils/errors";
import { inject, injectable } from "inversify";
import { BlankMessage } from "../domain/blank-message";
import { Message } from "../domain/message";
import { Thread } from "../domain/thread";
import type { AskInput, CreateThreadInput } from "./agent.dto";
import { buildMessages } from "./agent.messages";
import { buildGraph } from "./graph/graph";
import {
	AgentModel,
	AgentTools,
	MessageRepository,
	ProfileRepository,
	ThreadRepository,
} from "./ports/index";

const BAD_GATEWAY = 502;

@injectable()
export class AgentService {
	constructor(
		@inject(AgentModel)
		private readonly model: AgentModel,
		@inject(AgentTools)
		private readonly tools: AgentTools,
		@inject(ProfileRepository)
		private readonly profilesRepo: ProfileRepository,
		@inject(ThreadRepository)
		private readonly threadsRepo: ThreadRepository,
		@inject(MessageRepository)
		private readonly messagesRepo: MessageRepository,
		@inject(IdGenerator) private readonly ids: IdGenerator,
	) {}

	async createThread({ handle }: CreateThreadInput): Promise<Thread> {
		const profile = await this.profilesRepo.getByHandle(handle);

		const thread = new Thread({
			id: this.ids.next(),
			bioId: profile.id,
			createdAt: new Date(),
		});

		await this.threadsRepo.add(thread);

		return thread;
	}

	async ask({ threadId, message }: AskInput): Promise<string> {
		const thread = await this.threadsRepo.find(threadId);

		if (!thread) {
			throw new NotFound(
				ErrorCode.THREAD_NOT_FOUND,
				`No thread found for id "${threadId}"`,
			);
		}

		const profile = await this.profilesRepo.getById(thread.bioId);

		const question = new Message({
			id: this.ids.next(),
			threadId,
			role: "user",
			content: message,
			createdAt: new Date(),
		});

		const past = await this.messagesRepo.list(threadId);

		const reply = await this.runAgent(profile.handle, [...past, question]);

		try {
			const answer = new Message({
				id: this.ids.next(),
				threadId,
				role: "assistant",
				content: reply,
				createdAt: new Date(),
			});

			// TODO: save both in one transaction, a failure between them leaves a question without a reply.
			await this.messagesRepo.add(question);

			await this.messagesRepo.add(answer);
		} catch (err) {
			if (!(err instanceof BlankMessage)) throw err;

			throw new AppError(
				ErrorCode.AGENT_EMPTY_REPLY,
				BAD_GATEWAY,
				"The model returned an empty reply",
			);
		}

		return reply;
	}

	private async runAgent(handle: string, history: Message[]): Promise<string> {
		const toolbox = await this.tools.open(handle);

		try {
			const graph = buildGraph(this.model, toolbox.tools);

			const { reply } = await graph.invoke({
				messages: buildMessages(history),
			});

			return reply.text;
		} finally {
			await toolbox.close();
		}
	}
}
