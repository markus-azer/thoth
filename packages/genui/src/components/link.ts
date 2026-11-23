import { defineComponent } from "@openuidev/lang-core";
import { z } from "@thoth/utils/zod";

export const MAX_LABEL_LENGTH = 40;

const HTTPS_ONLY = /^https$/;

const LabelSchema = z
	.string()
	.trim()
	.min(1, "A label cannot be empty")
	.max(MAX_LABEL_LENGTH, `A label has at most ${MAX_LABEL_LENGTH} characters`);

const UrlSchema = z.url({
	protocol: HTTPS_ONLY,
	error: "A url must start with https",
});

export const Link = defineComponent({
	name: "Link",
	description:
		"A link to a web page, shown with a short label. Only for a URL that appears in the answer.",
	props: z.object({
		label: LabelSchema,
		url: UrlSchema,
	}),
	component: null,
});
