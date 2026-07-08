import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { Postgres } from "~/infrastructure/db/postgres";

const mockPool = {
	query: vi.fn(),
	end: vi.fn(),
};

vi.mock("pg", () => ({
	Pool: vi.fn(function Pool() {
		return mockPool;
	}),
}));

describe("Postgres", () => {
	it("RULE-DB-001: `start()` runs `SELECT 1`. If it errors, start fails", async () => {
		mockPool.query.mockResolvedValueOnce({ rows: [] });
		const ok = new Postgres();
		await ok.start();
		expect(mockPool.query).toHaveBeenCalledWith("SELECT 1");

		mockPool.query.mockRejectedValueOnce(new Error("unreachable"));
		const bad = new Postgres();
		await expect(bad.start()).rejects.toThrow("unreachable");
	});

	it("RULE-DB-002: `stop()` calls `pool.end()`, draining active queries", async () => {
		mockPool.end.mockResolvedValueOnce(undefined);
		const pg = new Postgres();
		await pg.stop();
		expect(mockPool.end).toHaveBeenCalled();
	});

	it("RULE-DB-003: `query<T>(sql, params?)` returns `rows` directly", async () => {
		const rows = [{ id: 1 }, { id: 2 }];
		mockPool.query.mockResolvedValueOnce({ rows });
		const pg = new Postgres();
		const result = await pg.query<{ id: number }>("SELECT id FROM t", [1]);
		expect(result).toBe(rows);
		expect(mockPool.query).toHaveBeenCalledWith("SELECT id FROM t", [1]);
	});
});
