import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import type { Postgres } from "~/infrastructure/db/index";
import { HandleTaken } from "~/modules/bio/application/bio.repository";
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

const fields = {
	handle: row.handle,
	name: row.name,
	headline: row.headline,
	about: row.about,
};

const newBio = { id: row.id, ...fields };

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

	it("RULE-BIO-006: `create_bio`, no existing bio for the caller → CREATED.", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([row]);

		await expect(repo.insert("u1", newBio)).resolves.toEqual(bio);
		expect(query).toHaveBeenCalledWith(
			expect.stringContaining("ON CONFLICT (user_id) DO NOTHING"),
			[row.id, "u1", row.handle, row.name, row.headline, row.about],
		);
	});

	it("insert returns null when the caller already has a bio", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([]);

		await expect(repo.insert("u1", newBio)).resolves.toBeNull();
	});

	it("RULE-BIO-008: `update_bio`, an existing bio for the caller → UPDATED.", async () => {
		const { repo, query } = setup();
		const updated = { ...row, name: "New Name" };
		query.mockResolvedValue([updated]);

		const result = await repo.update("u1", { ...fields, name: "New Name" });

		expect(result).toEqual(new Bio({ ...bio, name: "New Name" }));
		expect(query).toHaveBeenCalledWith(
			expect.stringContaining("WHERE user_id = $1"),
			["u1", row.handle, "New Name", row.headline, row.about],
		);
	});

	it("update returns null when the caller has no bio", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([]);

		await expect(repo.update("u1", fields)).resolves.toBeNull();
	});

	it("throws HandleTaken when update hits another user's handle", async () => {
		const { repo, query } = setup();
		query.mockRejectedValue({ code: "23505", constraint: "bio_handle_key" });

		await expect(repo.update("u2", fields)).rejects.toBeInstanceOf(HandleTaken);
	});

	it("throws HandleTaken when insert hits another user's handle", async () => {
		const { repo, query } = setup();
		query.mockRejectedValue({ code: "23505", constraint: "bio_handle_key" });

		await expect(repo.insert("u2", newBio)).rejects.toBeInstanceOf(HandleTaken);
	});

	it("does not treat a unique violation on a different constraint as HandleTaken", async () => {
		const { repo, query } = setup();
		const pkViolation = { code: "23505", constraint: "bio_pkey" };
		query.mockRejectedValue(pkViolation);

		await expect(repo.insert("u1", newBio)).rejects.toBe(pkViolation);
	});

	it("lets errors other than a unique violation propagate", async () => {
		const { repo, query } = setup();
		const boom = new Error("connection lost");
		query.mockRejectedValue(boom);

		await expect(repo.update("u1", fields)).rejects.toBe(boom);
	});
});
