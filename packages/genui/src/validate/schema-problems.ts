import { isElementNode, type Library } from "@openuidev/lang-core";
import { line } from "./line";
import { plainProps } from "./plain-props";
import { pointsIntoChild } from "./points-into-child";

type Issue = { path: PropertyKey[]; message: string };

const pathText = (path: PropertyKey[]) => path.map(String).join("/");

export const schemaProblems = (library: Library, value: unknown): string[] => {
	if (Array.isArray(value)) {
		return value.flatMap((item) => schemaProblems(library, item));
	}

	if (!isElementNode(value)) return [];

	const component = library.components[value.typeName];

	if (!component) return [];

	const result = component.props.safeParse(plainProps(value));
	const issues: Issue[] = result.success ? [] : result.error.issues;
	const ownIssues = issues.filter(
		({ path }) => !pointsIntoChild(value.props, path),
	);

	const own = ownIssues.map(({ path, message }) => {
		const where = `${value.typeName}/${pathText(path)}`;

		return line(where, message);
	});

	const children = Object.values(value.props).flatMap((child) =>
		schemaProblems(library, child),
	);

	return [...own, ...children];
};
