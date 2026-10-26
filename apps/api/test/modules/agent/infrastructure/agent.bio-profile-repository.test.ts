import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { BioProfileRepository } from "~/modules/agent/infrastructure/agent.bio-profile-repository";
import { Bio } from "~/modules/bio/domain/bio";
import type { BioService } from "~/modules/bio/index";

const bio = new Bio({
	id: "018e5e9a-79c1-7c3e-8b1a-0000000000aa",
	userId: "u1",
	handle: "markus-azer",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
	createdAt: new Date(2026, 0, 1),
	updatedAt: new Date(2026, 0, 1),
});

const profile = {
	id: bio.id,
	handle: "markus-azer",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
};

const setup = () => {
	const bios = {
		get: vi.fn().mockResolvedValue(bio),
		getById: vi.fn().mockResolvedValue(bio),
	};
	const repo = new BioProfileRepository(bios as unknown as BioService);
	return { repo, bios };
};

describe("BioProfileRepository", () => {
	it("getByHandle returns the bio's public profile", async () => {
		const { repo, bios } = setup();

		const result = await repo.getByHandle("markus-azer");

		expect(result).toEqual(profile);
		expect(bios.get).toHaveBeenCalledWith("markus-azer");
	});

	it("getById returns the bio's public profile", async () => {
		const { repo, bios } = setup();

		const result = await repo.getById(bio.id);

		expect(result).toEqual(profile);
		expect(bios.getById).toHaveBeenCalledWith(bio.id);
	});
});
