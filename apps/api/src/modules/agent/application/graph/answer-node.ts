import { buildModelInput } from "../agent.prompt";
import type { AgentModel } from "../ports/index";
import type { AgentState } from "./state";

export const makeAnswerNode =
	(model: AgentModel) =>
	async (state: AgentState): Promise<Pick<AgentState, "reply">> => {
		const input = buildModelInput(state.context);

		const reply = await model.answer(input);

		return { reply };
	};
