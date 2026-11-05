import { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { AgentContext } from "./agent.context";
import { buildInstructions } from "./agent.instructions";
import type { ModelInput } from "./ports/index";

export const buildModelInput = ({
	profile,
	history,
}: AgentContext): ModelInput => {
	const messages = history.map(({ role, content }) => {
		if (role === "user") return new HumanMessage(content);

		if (role === "assistant") return new AIMessage(content);

		throw new Error(`Unknown role: ${role}`);
	});

	return { system: buildInstructions(profile), messages, tools: [] };
};
