import type { StructuredToolInterface } from "@langchain/core/tools";
import { END, START, StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import type { AgentModel } from "../ports/index";
import { makeModelNode } from "./nodes/model";
import { AgentState } from "./state";

export const buildGraph = (
	model: AgentModel,
	tools: StructuredToolInterface[],
) =>
	new StateGraph(AgentState)
		.addNode("model", makeModelNode(model, tools))
		.addNode("tools", new ToolNode(tools))
		.addEdge(START, "model")
		.addConditionalEdges("model", toolsCondition, ["tools", END])
		.addEdge("tools", "model")
		.compile();
