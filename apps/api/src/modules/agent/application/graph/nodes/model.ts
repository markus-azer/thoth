import type { StructuredToolInterface } from "@langchain/core/tools";
import type { AgentModel } from "~/modules/agent/application/ports/index";
import type { AgentState } from "../state";

const MAX_TOOL_ROUNDS = 5;

export const TOOLS_EXHAUSTED_NOTICE =
	"You have no tools left. Only say an action succeeded if a tool result confirmed it. Tell the visitor what failed.";

export const makeModelNode =
	(model: AgentModel, tools: StructuredToolInterface[], instructions: string) =>
	async ({ messages, toolRounds }: AgentState) => {
		const toolsLeft = toolRounds < MAX_TOOL_ROUNDS;

		const system = toolsLeft
			? instructions
			: `${instructions}\n${TOOLS_EXHAUSTED_NOTICE}`;

		const offeredTools = toolsLeft ? tools : [];

		const reply = await model.answer({ system, messages, tools: offeredTools });

		const update = { messages: [reply], reply };

		if (!reply.tool_calls?.length) return update;

		return { ...update, toolRounds: toolRounds + 1 };
	};
