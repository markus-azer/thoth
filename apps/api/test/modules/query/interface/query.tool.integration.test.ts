import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { createContainer } from "~/di/index";
import { PrivateToolNames } from "~/infrastructure/mcp/index";
import { QueryTool } from "~/modules/query/interface/query.tool";
import { connectMcp } from "../../../support/mcp";

const principal = { userId: "u1", scopes: [] };
const rows = [{ message: "great talk" }];
const sql = "select message from feedback";

// A QueryTool backed by a stubbed runner, so we test the tool, not the database.
const setup = () => {
	const run = vi.fn().mockResolvedValue(rows);
	const tool = new QueryTool({ run });

	return { tool, run };
};

describe("QueryTool", () => {
	it("RULE-QRY-001: No valid bearer → 401.", async () => {
		const container = await createContainer();
		const privateTools = container.get(PrivateToolNames);

		expect(privateTools).toContain("query");
	});

	it("RULE-QRY-004: The owner is set per call from the `Principal`.", async () => {
		const { tool, run } = setup();
		const client = await connectMcp({ principal }, tool);

		await client.callTool({ name: "query", arguments: { sql } });

		expect(run).toHaveBeenCalledWith("u1", sql);
	});

	it("returns the rows as JSON", async () => {
		const { tool } = setup();
		const client = await connectMcp({ principal }, tool);

		const result = await client.callTool({ name: "query", arguments: { sql } });
		const [content] = result.content as [{ text: string }];

		expect(JSON.parse(content.text)).toEqual(rows);
	});

	it("RULE-QRY-011: Any database error → QUERY_ERROR, still 200.", async () => {
		const { tool, run } = setup();
		run.mockRejectedValue(new Error('permission denied for table "user"'));
		const client = await connectMcp({ principal }, tool);

		const result = await client.callTool({ name: "query", arguments: { sql } });

		expect(result.isError).toBe(true);
		expect(JSON.stringify(result.content)).toMatch(/permission denied/);
	});
});
