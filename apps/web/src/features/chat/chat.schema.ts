import { z } from "@thoth/utils/zod";

const MAX_MESSAGE_LENGTH = 500;

export const ThreadSchema = z.object({ id: z.uuid() });

export const ReplySchema = z.object({ reply: z.string() });

const TurnSchema = z.object({
	role: z.enum(["visitor", "agent"]),
	text: z.string(),
});

export const ConversationSchema = z.object({
	id: z.string().min(1),
	threadId: z.uuid().nullable(),
	title: z.string(),
	turns: z.array(TurnSchema),
});

export type Conversation = z.infer<typeof ConversationSchema>;

export const toMessage = (text: string): string | null => {
	const trimmed = text.trim();
	const capped = trimmed.slice(0, MAX_MESSAGE_LENGTH).trim();

	if (capped === "") {
		return null;
	}

	return capped;
};
