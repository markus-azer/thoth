import "reflect-metadata";
import { Conflict, ErrorCode } from "@thoth/utils";
import { describe, expect, it, vi } from "vitest";
import type { BioService } from "~/modules/bio/application/bio.service";
import { Bio } from "~/modules/bio/domain/bio";
import { BioTool } from "~/modules/bio/interface/bio.tool";
import { connectMcp } from "../../../support/mcp";

const sampleBio = new Bio({
	id: "018e5e9a-79c1-7c3e-8b1a-000000000001",
	userId: "u1",
	handle: "markus-azer",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
	createdAt: new Date(2026, 0, 1),
	updatedAt: new Date(2026, 0, 1),
});

const input = {
	handle: "markus-azer",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
};

const principal = { userId: "u1", scopes: [] };

// A BioTool backed by a stubbed service, so we test the tool, not the service.
const setup = () => {
	const get = vi.fn().mockResolvedValue(sampleBio);
	const create = vi.fn().mockResolvedValue(sampleBio);
	const update = vi.fn().mockResolvedValue(sampleBio);
	const tool = new BioTool({ get, create, update } as unknown as BioService);
	return { tool, get, create, update };
};

describe("BioTool", () => {
	it("registers get_bio, create_bio, and update_bio", async () => {
		const { tool } = setup();
		const client = await connectMcp({}, tool);

		const { tools } = await client.listTools();
		expect(tools.map((t) => t.name)).toEqual(
			expect.arrayContaining(["get_bio", "create_bio", "update_bio"]),
		);
	});

	it("RULE-BIO-001: FOUND includes the name, headline, and about.", async () => {
		const { tool } = setup();
		const client = await connectMcp({ handle: "markus-azer" }, tool);

		const result = await client.callTool({ name: "get_bio", arguments: {} });

		expect(result.isError).toBeFalsy();
		expect(JSON.stringify(result.content)).toMatch(/Markus Azer/);
		expect(JSON.stringify(result.content)).toMatch(/Software Engineer/);
		expect(JSON.stringify(result.content)).toMatch(/Builds things\./);
	});

	it("get_bio passes the handle through to the lookup", async () => {
		const { tool, get } = setup();
		const client = await connectMcp({ handle: "markus-azer" }, tool);

		await client.callTool({ name: "get_bio", arguments: {} });

		expect(get).toHaveBeenCalledWith("markus-azer");
	});

	it("create_bio writes under the caller's principal", async () => {
		const { tool, create } = setup();
		const client = await connectMcp({ principal }, tool);

		const result = await client.callTool({
			name: "create_bio",
			arguments: input,
		});

		expect(result.isError).toBeFalsy();
		expect(create).toHaveBeenCalledWith("u1", input);
	});

	it("update_bio writes under the caller's principal", async () => {
		const { tool, update } = setup();
		const client = await connectMcp({ principal }, tool);

		const result = await client.callTool({
			name: "update_bio",
			arguments: input,
		});

		expect(result.isError).toBeFalsy();
		expect(update).toHaveBeenCalledWith("u1", input);
	});

	it("RULE-BIO-011: Empty `handle`, `name`, `headline`, or `about` → INVALID_INPUT.", async () => {
		const { tool, create } = setup();
		const client = await connectMcp({ principal }, tool);

		for (const field of ["handle", "name", "headline", "about"] as const) {
			const result = await client.callTool({
				name: "create_bio",
				arguments: { ...input, [field]: "" },
			});

			expect(result.isError).toBe(true);
		}

		expect(create).not.toHaveBeenCalled();
	});

	it("RULE-BIO-012: A `handle` that isn't a lowercase, hyphen-separated slug → INVALID_INPUT.", async () => {
		const { tool, create } = setup();
		const client = await connectMcp({ principal }, tool);

		const result = await client.callTool({
			name: "create_bio",
			arguments: { ...input, handle: "MARKUS-AZER" },
		});

		expect(result.isError).toBe(true);
		expect(create).not.toHaveBeenCalled();
	});

	it("surfaces HANDLE_TAKEN as a tool-level error", async () => {
		const { tool, create } = setup();
		create.mockRejectedValue(
			new Conflict(
				ErrorCode.BIO_HANDLE_TAKEN,
				'Handle "markus-azer" is already taken',
			),
		);
		const client = await connectMcp({ principal }, tool);

		const result = await client.callTool({
			name: "create_bio",
			arguments: input,
		});

		expect(result.isError).toBe(true);
		expect(JSON.stringify(result.content)).toMatch(/already taken/);
	});
});
