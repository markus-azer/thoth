import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import type { Postgres } from "~/infrastructure/db/index";
import { Bio } from "~/modules/bio/domain/bio";
import { PostgresBioRepository } from "~/modules/bio/infrastructure/bio.pg-repository";

const row = {
	id: "018e5e9a-79c1-7c3e-8b1a-000000000001",
	userId: "u1",
	handle: "markus-azer",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
	createdAt: new Date(2026, 0, 1),
	updatedAt: new Date(2026, 0, 1),
};

const bio = new Bio(row);

const setup = () => {
	const query = vi.fn();
	const repo = new PostgresBioRepository({ query } as unknown as Postgres);
	return { repo, query };
};

describe("PostgresBioRepository", () => {
	it("findByHandle returns the matching bio", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([row]);

		await expect(repo.findByHandle("markus-azer")).resolves.toEqual(bio);
		expect(query).toHaveBeenCalledWith(
			expect.stringContaining("WHERE handle = $1"),
			["markus-azer"],
		);
	});

	it("findByHandle returns null when no row matches", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([]);

		await expect(repo.findByHandle("nobody")).resolves.toBeNull();
	});
});
