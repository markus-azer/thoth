import { END, START, StateGraph } from "@langchain/langgraph";
import type { AgentModel } from "../ports/index";
import { makeAnswerNode } from "./answer-node";
import { AgentState } from "./state";

export const buildGraph = (model: AgentModel) =>
	new StateGraph(AgentState)
		.addNode("answer", makeAnswerNode(model))
		.addEdge(START, "answer")
		.addEdge("answer", END)
		.compile();
