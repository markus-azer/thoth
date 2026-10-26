import { z } from "@thoth/utils";

export const ThreadOutputSchema = z.object({ id: z.uuid() }).openapi("Thread");

export const ReplyOutputSchema = z
	.object({ reply: z.string() })
	.openapi("Reply");

export type ThreadOutputDTO = z.infer<typeof ThreadOutputSchema>;

export type ReplyOutputDTO = z.infer<typeof ReplyOutputSchema>;
