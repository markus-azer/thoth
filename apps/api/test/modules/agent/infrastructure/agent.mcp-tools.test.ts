import "reflect-metadata";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { describe, expect, it, vi } from "vitest";
import type { McpRequestContext, McpTool } from "~/infrastructure/mcp/index";
import { McpAgentTools } from "~/modules/agent/infrastructure/agent.mcp-tools";

class FakeTool implements McpTool {
	register(server: McpServer, { handle }: McpRequestContext): void {
		server.registerTool(
			"get_bio",
			{ description: "Reads a bio." },
			async () => ({
				content: [{ type: "text", text: `bio of ${handle}` }],
			}),
		);

		server.registerTool(
			"update_bio",
			{ description: "Writes a bio." },
			async () => ({
				content: [{ type: "text", text: "updated" }],
			}),
		);

		server.registerTool(
			"broken",
			{ description: "Always fails." },
			async () => {
				throw new Error("boom");
			},
		);
	}
}

const setup = () =>
	new McpAgentTools([new FakeTool()], new Set(["update_bio"]));

describe("McpAgentTools", () => {
	it("RULE-AGENT-001: The agent can call the public tools on the thread owner's behalf.", async () => {
		const toolbox = await setup().open("markus-azer");

		const getBio = toolbox.tools.find(({ name }) => name === "get_bio");
		const result = await getBio?.invoke({});

		expect(result).toBe("bio of markus-azer");
		await toolbox.close();
	});

	it("RULE-AGENT-002: Private tools are never available to the agent.", async () => {
		const toolbox = await setup().open("markus-azer");

		const names = toolbox.tools.map(({ name }) => name);

		expect(names).not.toContain("update_bio");
		expect(names).toContain("get_bio");
		await toolbox.close();
	});

	it("raises a tool's failure so the graph can hand it to the model", async () => {
		const toolbox = await setup().open("markus-azer");

		const broken = toolbox.tools.find(({ name }) => name === "broken");

		await expect(broken?.invoke({})).rejects.toThrow("boom");
		await toolbox.close();
	});

	it("closes the client and server when listing the tools fails", async () => {
		vi.spyOn(Client.prototype, "listTools").mockRejectedValueOnce(
			new Error("list failed"),
		);
		const closeClient = vi.spyOn(Client.prototype, "close");
		const closeServer = vi.spyOn(McpServer.prototype, "close");

		await expect(setup().open("markus-azer")).rejects.toThrow("list failed");

		expect(closeClient).toHaveBeenCalledOnce();
		expect(closeServer).toHaveBeenCalledOnce();
		vi.restoreAllMocks();
	});
});
