import { ErrorCode } from "./error-codes";
import { BadRequest } from "./errors";
import { z } from "./zod";

export const parseInput = <T extends z.ZodType>(
	schema: T,
	data: unknown,
): z.infer<T> => {
	const parsed = schema.safeParse(data);

	if (parsed.success) return parsed.data;

	throw new BadRequest(
		ErrorCode.INVALID_REQUEST,
		z.prettifyError(parsed.error),
	);
};
