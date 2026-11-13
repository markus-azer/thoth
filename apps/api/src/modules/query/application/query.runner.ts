export const QueryRunner = Symbol("QueryRunner");

export type Row = Record<string, unknown>;

export interface QueryRunner {
	// Runs the sql as the owner, so it sees only their rows.
	run(userId: string, sql: string): Promise<Row[]>;
}
