import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenRouter } from "@langchain/openrouter";
import { injectable } from "inversify";
import { env } from "~/env";
import { log } from "~/logger";
import type { UiModel, WriteInput } from "../application/ports/index";

const WRITE_TIMEOUT_MS = 8_000;

@injectable()
export class OpenRouterUiModel implements UiModel {
	private readonly model = new ChatOpenRouter({
		model: env.LLM_MODEL,
		apiKey: env.OPENROUTER_API_KEY,
		temperature: 0,
		modelKwargs: { reasoning: { effort: "none" } },
	});

	async write({ system, prompt }: WriteInput): Promise<string> {
		try {
			const reply = await this.model.invoke(
				[new SystemMessage(system), { role: "user", content: prompt }],
				{ signal: AbortSignal.timeout(WRITE_TIMEOUT_MS) },
			);

			return reply.text;
		} catch (err) {
			log.warn("UI write failed", { err });

			return "";
		}
	}
}
