import { HandleSchema } from "@thoth/utils/handle";
import { z } from "@thoth/utils/zod";

export const CreateThreadInputSchema = z
	.object({ handle: HandleSchema })
	.openapi("CreateThreadInput");

export type CreateThreadInput = z.infer<typeof CreateThreadInputSchema>;

export const AskInputSchema = z
	.object({
		threadId: z.uuid(),
		message: z.string().trim().min(1).max(1000),
	})
	.openapi("AskInput");

export const AskParamsSchema = AskInputSchema.pick({ threadId: true });

export const AskBodySchema = AskInputSchema.pick({ message: true });

export type AskInput = z.infer<typeof AskInputSchema>;
