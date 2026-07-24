import { z } from "@thoth/utils";

export const NewFeedbackSchema = z
	.object({
		message: z.string().trim().min(1).max(5000),
		name: z.string().trim().max(100).optional(),
		topic: z.string().trim().max(100).optional(),
		email: z.email().max(254).optional(),
	})
	.openapi("NewFeedback");

export type NewFeedbackDTO = z.infer<typeof NewFeedbackSchema>;
