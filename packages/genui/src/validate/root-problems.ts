import type { ElementNode, Library } from "@openuidev/lang-core";

export const rootProblems = (
	library: Library,
	root: ElementNode | null,
): string[] => {
	if (root === null) return ["root is missing"];

	if (library.root === undefined) return [];

	if (root.typeName === library.root) return [];

	return [`root must be a ${library.root}`];
};
