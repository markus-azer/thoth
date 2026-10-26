import { z } from "./zod";

export const HandleSchema = z
	.string()
	.trim()
	.min(1)
	.max(60)
	.regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
