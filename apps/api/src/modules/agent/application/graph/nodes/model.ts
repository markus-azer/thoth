import { AIMessage } from "@langchain/core/messages";
import type { StructuredToolInterface } from "@langchain/core/tools";
import type { AgentModel } from "~/modules/agent/application/ports/index";
import { INSTRUCTIONS } from "../instructions";
import type { AgentState } from "../state";

const MAX_TOOL_ROUNDS = 5;

export const TOOLS_EXHAUSTED_NOTICE =
	"You have no tools left. Only say an action succeeded if a tool result confirmed it. Tell the visitor what failed.";

export const makeModelNode =
	(model: AgentModel, tools: StructuredToolInterface[]) =>
	async ({ messages, toolRounds }: AgentState) => {
		const toolsLeft = toolRounds < MAX_TOOL_ROUNDS;

		const system = toolsLeft
			? INSTRUCTIONS
			: `${INSTRUCTIONS}\n${TOOLS_EXHAUSTED_NOTICE}`;

		const reply = await model.answer({
			system,
			messages,
			tools,
			allowTools: toolsLeft,
		});

		const askedForTools = Boolean(reply.tool_calls?.length);

		if (!askedForTools) return { messages: [reply], reply };

		if (!toolsLeft) {
			const textOnly = new AIMessage(reply.text);

			return { messages: [textOnly], reply: textOnly };
		}

		return { messages: [reply], reply, toolRounds: toolRounds + 1 };
	};
