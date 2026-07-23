import { z } from "@thoth/utils";

export const NewFeedbackSchema = z
	.object({
		message: z.string().min(1),
		name: z.string().optional(),
		topic: z.string().optional(),
		email: z.email().optional(),
	})
	.openapi("NewFeedback");

export type NewFeedbackDTO = z.infer<typeof NewFeedbackSchema>;
