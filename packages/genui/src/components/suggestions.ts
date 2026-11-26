import { defineComponent } from "@openuidev/lang-core";
import { z } from "@thoth/utils/zod";

export const MAX_QUESTIONS = 4;
export const MAX_QUESTION_LENGTH = 80;

const QuestionSchema = z
	.string()
	.trim()
	.min(1, "A question cannot be empty")
	.max(
		MAX_QUESTION_LENGTH,
		`A question has at most ${MAX_QUESTION_LENGTH} characters`,
	);

const QuestionsSchema = z
	.array(QuestionSchema)
	.min(1, "Give at least 1 question")
	.max(MAX_QUESTIONS, `Give at most ${MAX_QUESTIONS} questions`)
	.refine(
		(questions) => new Set(questions).size === questions.length,
		"Give each question once",
	);

export const Suggestions = defineComponent({
	name: "Suggestions",
	description:
		"2 or 3 short follow-up questions the visitor can click to ask next. Use when the answer invites a next step.",
	props: z.object({
		questions: QuestionsSchema,
	}),
	component: null,
});
