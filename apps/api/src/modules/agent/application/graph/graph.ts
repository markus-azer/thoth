import type { StructuredToolInterface } from "@langchain/core/tools";
import { END, START, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { AgentModel, UiModel } from "../ports/index";
import { afterCompose, makeComposeNode } from "./nodes/compose";
import { afterModel, makeModelNode } from "./nodes/model";
import { AgentState } from "./state";

// Wiring only. Node and edge logic lives in nodes/.
// TODO: enforce this with a hard linter (GritQL plugin).
export const buildGraph = (
	model: AgentModel,
	tools: StructuredToolInterface[],
	ui: UiModel,
) =>
	new StateGraph(AgentState)
		.addNode("model", makeModelNode(model, tools))
		.addNode("tools", new ToolNode(tools))
		.addNode("compose", makeComposeNode(ui))
		.addEdge(START, "model")
		.addConditionalEdges("model", afterModel, ["tools", "compose"])
		.addEdge("tools", "model")
		.addConditionalEdges("compose", afterCompose, ["compose", END])
		.compile();
