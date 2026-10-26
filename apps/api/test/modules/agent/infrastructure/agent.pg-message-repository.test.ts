import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import type { Postgres } from "~/infrastructure/db/index";
import { Message } from "~/modules/agent/domain/message";
import { PostgresMessageRepository } from "~/modules/agent/infrastructure/agent.pg-message-repository";

const row = {
	id: "m1",
	threadId: "018e5e9a-79c1-7c3e-8b1a-000000000001",
	role: "user",
	content: "hi",
	createdAt: new Date(2026, 0, 1),
} as const;

const message = new Message(row);

const setup = () => {
	const query = vi.fn();
	const repo = new PostgresMessageRepository({ query } as unknown as Postgres);
	return { repo, query };
};

describe("PostgresMessageRepository", () => {
	it("list returns the thread messages in order", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([row]);

		const messages = await repo.list(row.threadId);

		expect(messages).toEqual([message]);
	});

	it("list asks for the messages of that thread, oldest first", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([]);

		await repo.list(row.threadId);

		expect(query).toHaveBeenCalledWith(expect.stringContaining("ORDER BY id"), [
			row.threadId,
		]);
	});

	it("add inserts one message", async () => {
		const { repo, query } = setup();
		query.mockResolvedValue([]);

		await repo.add(message);

		expect(query).toHaveBeenCalledWith(
			expect.stringContaining("INSERT INTO messages"),
			["m1", row.threadId, "user", "hi", row.createdAt],
		);
	});
});
