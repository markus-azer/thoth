import { isElementNode } from "@openuidev/lang-core";

const valueAt = (parent: unknown, key: PropertyKey): unknown => {
	if (typeof parent !== "object" || parent === null) return undefined;

	return Reflect.get(parent, key);
};

// A child element reports its own problems, so the parent skips issues inside it.
export const pointsIntoChild = (
	props: unknown,
	path: PropertyKey[],
): boolean => {
	let current = props;

	for (const key of path) {
		if (isElementNode(current)) return true;

		current = valueAt(current, key);
	}

	return false;
};
