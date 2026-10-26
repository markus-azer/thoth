import { z } from "@thoth/utils";

const ThreadOutputSchema = z.object({ id: z.uuid() }).openapi("Thread");

const ReplyOutputSchema = z.object({ reply: z.string() }).openapi("Reply");

export type ThreadOutputDTO = z.infer<typeof ThreadOutputSchema>;

export type ReplyOutputDTO = z.infer<typeof ReplyOutputSchema>;
