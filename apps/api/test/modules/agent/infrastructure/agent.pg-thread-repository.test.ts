import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import type { Postgres } from "~/infrastructure/db/index";
import { Thread } from "~/modules/agent/domain/thread";
import { PostgresThreadRepository } from "~/modules/agent/infrastructure/agent.pg-thread-repository";

const row = {
	id: "018e5e9a-79c1-7c3e-8b1a-000000000001",
	bioId: "018e5e9a-79c1-7c3e-8b1a-0000000000aa",
	createdAt: new Date(2026, 0, 1),
};

const setup = () => {
	const query = vi.fn();
	const repo = new PostgresThreadRepository({ query } as unknown as Postgres);
	return { repo, query };
};

describe("PostgresThreadRepository", () => {
	it("find returns the matching thread", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([row]);

		const thread = await repo.find(row.id);

		expect(thread).toEqual(new Thread(row));
		expect(query).toHaveBeenCalledWith(
			expect.stringContaining("WHERE id = $1"),
			[row.id],
		);
	});

	it("find returns null when no row matches", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([]);

		const thread = await repo.find(row.id);

		expect(thread).toBeNull();
	});

	it("add inserts one thread with the bio it is about", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([]);

		await repo.add(new Thread(row));

		expect(query).toHaveBeenCalledWith(
			expect.stringContaining("INSERT INTO threads"),
			[row.id, row.bioId, row.createdAt],
		);
	});
});
