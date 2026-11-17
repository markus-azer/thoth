import { isElementNode } from "@openuidev/lang-core";

// A child element becomes its plain props, the shape a parent schema expects.
export const plainProps = (value: unknown): unknown => {
	if (Array.isArray(value)) return value.map(plainProps);

	if (!isElementNode(value)) return value;

	const entries = Object.entries(value.props);
	const plainEntries = entries.map(([key, prop]) => [key, plainProps(prop)]);

	return Object.fromEntries(plainEntries);
};
