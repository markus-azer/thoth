const UNIQUE_VIOLATION = "23505";

type PgError = { code: string; constraint?: string };

const isPgError = (err: unknown): err is PgError =>
	typeof err === "object" && err !== null && "code" in err;

export const isUniqueViolation = (err: unknown, constraint: string): boolean =>
	isPgError(err) &&
	err.code === UNIQUE_VIOLATION &&
	err.constraint === constraint;
