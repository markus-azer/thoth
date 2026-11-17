import { defineComponent } from "@openuidev/lang-core";
import { z } from "@thoth/utils/zod";
import { Link } from "./link";
import { Suggestions } from "./suggestions";

export const MAX_CHILDREN = 6;

const ChildSchema = z.union(
	[Suggestions.ref, Link.ref],
	"A child must be a valid Suggestions or Link",
);

const ChildrenSchema = z
	.array(ChildSchema)
	.min(1, "Give at least 1 child")
	.max(MAX_CHILDREN, `Give at most ${MAX_CHILDREN} children`);

export const Stack = defineComponent({
	name: "Stack",
	description: "Vertical layout that holds the other components.",
	props: z.object({
		children: ChildrenSchema,
	}),
	component: null,
});
