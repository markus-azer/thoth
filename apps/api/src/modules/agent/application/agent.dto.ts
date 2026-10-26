import { HandleSchema, z } from "@thoth/utils";

const CreateThreadInputSchema = z
	.object({ handle: HandleSchema })
	.openapi("CreateThreadInput");

export type CreateThreadInput = z.infer<typeof CreateThreadInputSchema>;

const AskInputSchema = z
	.object({
		threadId: z.uuid(),
		message: z.string().trim().min(1).max(1000),
	})
	.openapi("AskInput");

export type AskInput = z.infer<typeof AskInputSchema>;
