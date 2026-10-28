import { ChatOpenRouter } from "@langchain/openrouter";
import { ErrorCode } from "@thoth/utils/error-codes";
import { AppError } from "@thoth/utils/errors";
import { injectable } from "inversify";
import { env } from "~/env";
import { log } from "~/logger";
import type { AgentModel, ModelInput } from "../application/ports/index";

const BAD_GATEWAY = 502;
const MODEL_TIMEOUT_MS = 30_000;

@injectable()
export class OpenRouterAgentModel implements AgentModel {
	private readonly model = new ChatOpenRouter({
		model: env.LLM_MODEL,
		apiKey: env.OPENROUTER_API_KEY,
	});

	async answer({ system, messages }: ModelInput): Promise<string> {
		const systemMessage = { role: "system", content: system };

		const conversation = [systemMessage, ...messages];

		try {
			const reply = await this.model.invoke(conversation, {
				signal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
			});

			return reply.text;
		} catch (err) {
			log.error("Model call failed", { err });

			throw new AppError(
				ErrorCode.AGENT_MODEL_UNAVAILABLE,
				BAD_GATEWAY,
				"The model is unavailable",
			);
		}
	}
}
