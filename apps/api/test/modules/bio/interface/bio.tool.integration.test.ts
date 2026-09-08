import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import type { BioService } from "~/modules/bio/application/bio.service";
import { Bio } from "~/modules/bio/domain/bio";
import { BioTool } from "~/modules/bio/interface/bio.tool";
import { connectMcp } from "../../../support/mcp";

const sampleBio = new Bio({
	id: "018e5e9a-79c1-7c3e-8b1a-000000000001",
	tenant: "markus",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
	createdAt: new Date(2026, 0, 1),
	updatedAt: new Date(2026, 0, 1),
});

// A BioTool backed by a stubbed service, so we test the tool, not the service.
const setup = (bio: Bio = sampleBio) => {
	const get = vi.fn().mockResolvedValue(bio);
	const tool = new BioTool({ get } as unknown as BioService);
	return { tool, get };
};

describe("BioTool", () => {
	it("registers get_bio", async () => {
		const { tool } = setup();
		const client = await connectMcp(tool);

		const { tools } = await client.listTools();
		expect(tools.map((t) => t.name)).toContain("get_bio");
	});

	it("RULE-BIO-001: FOUND includes the name, headline, and about", async () => {
		const { tool } = setup();
		const client = await connectMcp(tool);

		const result = await client.callTool({ name: "get_bio", arguments: {} });

		expect(result.isError).toBeFalsy();
		expect(JSON.stringify(result.content)).toMatch(/Markus Azer/);
		expect(JSON.stringify(result.content)).toMatch(/Software Engineer/);
		expect(JSON.stringify(result.content)).toMatch(/Builds things\./);
	});
});
