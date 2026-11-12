import { z } from "@thoth/utils/zod";

export const QueryInputSchema = z
	.object({
		sql: z.string().trim().min(1),
	})
	.openapi("QueryInput");
