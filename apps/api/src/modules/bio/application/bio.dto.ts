import { z } from "@thoth/utils";

export const BioInputSchema = z
	.object({
		handle: z.string().trim().min(1).max(60),
		name: z.string().trim().min(1).max(100),
		headline: z.string().trim().min(1).max(200),
		about: z.string().trim().min(1).max(5000),
	})
	.openapi("BioInput");

export type BioInputDTO = z.infer<typeof BioInputSchema>;
