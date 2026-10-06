import { z } from "@thoth/utils";

export const BioSchema = z.object({
	name: z.string().trim().min(1),
	headline: z.string().trim().min(1),
	about: z.string().trim().min(1),
});

export type Bio = z.infer<typeof BioSchema>;
