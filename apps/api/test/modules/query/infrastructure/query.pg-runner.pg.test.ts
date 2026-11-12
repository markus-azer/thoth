import "reflect-metadata";
import { Pool } from "pg";
import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { env } from "~/env";
import type { Postgres } from "~/infrastructure/db/index";
import { PostgresQueryRunner } from "~/modules/query/infrastructure/query.pg-runner";

const alice = "query-test-alice";
const bob = "query-test-bob";

// One connection, so a check after a call sees the session the call used.
const pool = new Pool({ connectionString: env.DATABASE_URL, max: 1 });
const runner = new PostgresQueryRunner({ pool } as Postgres);

const addUserWithFeedback = async (id: string) => {
	await pool.query(
		`INSERT INTO "user" (id, name, email, "emailVerified")
			VALUES ($1, $1, $1 || '@example.com', false)`,
		[id],
	);
	await pool.query(
		`INSERT INTO feedback (id, user_id, message, created_at)
			VALUES (gen_random_uuid(), $1, 'hi', now())`,
		[id],
	);
};

const deleteUsers = () =>
	pool.query(`DELETE FROM "user" WHERE id = ANY($1)`, [[alice, bob]]);

describe("PostgresQueryRunner", () => {
	beforeEach(async () => {
		await addUserWithFeedback(alice);
		await addUserWithFeedback(bob);
	});

	afterEach(deleteUsers);

	afterAll(() => pool.end());

	it("RULE-QRY-002: The query sees only rows whose `user_id` is the caller's.", async () => {
		const rows = await runner.run(alice, "select user_id from feedback");

		expect(rows).toEqual([{ user_id: alice }]);
	});

	it("RULE-QRY-003: The query runs as `llm_reader`, which can only `SELECT` exposed tables.", async () => {
		const privileges = `
			select
				current_user as role,
				has_table_privilege('feedback', 'SELECT') as can_select,
				has_table_privilege('feedback', 'DELETE') as can_delete`;
		const rows = await runner.run(alice, privileges);

		expect(rows).toEqual([
			{ role: "llm_reader", can_select: true, can_delete: false },
		]);
	});

	it("RULE-QRY-005: The query cannot change the owner.", async () => {
		const forge = `select set_config('app.user_id', '${bob}', true)`;
		const forging = runner.run(alice, forge);

		await expect(forging).rejects.toThrow(/permission denied/);
	});

	it("RULE-QRY-006: The transaction is read-only.", async () => {
		const writing = runner.run(alice, "create temp table t (x int)");

		await expect(writing).rejects.toThrow(/read-only transaction/);
	});

	it("RULE-QRY-007: The transaction is always rolled back.", async () => {
		const sessionState = `
			select
				current_user as role,
				current_setting('app.user_id', true) as owner`;

		await runner.run(alice, "select 1");
		const { rows } = await pool.query(sessionState);
		const [session] = rows;

		expect(session.role).toBe("api");
		expect(session.owner).toBe("");
	});

	it("RULE-QRY-008: More than one statement → QUERY_ERROR.", async () => {
		const running = runner.run(alice, "select 1; select 2");

		await expect(running).rejects.toThrow(/multiple commands/);
	});

	it("RULE-QRY-009: A query over 1 second → QUERY_ERROR.", async () => {
		const sleeping = runner.run(alice, "select pg_sleep(2)");

		await expect(sleeping).rejects.toThrow(/statement timeout/);
	});

	it("RULE-QRY-010: A table that is not exposed → QUERY_ERROR.", async () => {
		const reading = runner.run(alice, `select * from "user"`);

		await expect(reading).rejects.toThrow(/permission denied/);
	});

	it("RULE-QRY-012: The app connects as a non-superuser role.", async () => {
		const { rows } = await pool.query(
			"select rolsuper from pg_roles where rolname = current_user",
		);

		expect(rows).toEqual([{ rolsuper: false }]);
	});

	it("RULE-FB-009: Deleting a user deletes their feedbacks.", async () => {
		await pool.query(`DELETE FROM "user" WHERE id = $1`, [alice]);
		const rows = await runner.run(alice, "select id from feedback");

		expect(rows).toEqual([]);
	});
});
