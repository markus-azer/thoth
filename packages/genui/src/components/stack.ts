import { defineComponent } from "@openuidev/lang-core";
import { z } from "@thoth/utils/zod";
import { CONTENT_COMPONENTS } from "./content";

export const MAX_CHILDREN = 6;

const CHILD_NAMES = CONTENT_COMPONENTS.map(({ name }) => name).join(" or ");

const ChildSchema = z.union(
	CONTENT_COMPONENTS.map(({ ref }) => ref),
	`A child must be a valid ${CHILD_NAMES}`,
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
