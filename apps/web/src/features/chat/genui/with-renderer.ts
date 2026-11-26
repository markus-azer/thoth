import { type ComponentRenderer, defineComponent } from "@openuidev/react-lang";
import type { z } from "@thoth/utils/zod";

type ComponentDefinition<Props extends z.ZodObject> = {
	name: string;
	description: string;
	props: Props;
};

export const withRenderer = <Props extends z.ZodObject>(
	{ name, description, props }: ComponentDefinition<Props>,
	component: ComponentRenderer<z.infer<Props>>,
) => defineComponent({ name, description, props, component });
