import { createParser, type Library } from "@openuidev/lang-core";
import { line } from "./line";
import { rootProblems } from "./root-problems";
import { schemaProblems } from "./schema-problems";

const UNDEFINED_MESSAGE = "is used but never defined";
const UNUSED_MESSAGE = "is defined but never used";
const INCOMPLETE_MESSAGE = "program is incomplete";

export const createValidator = (library: Library) => {
	const parser = createParser(library.toJSONSchema(), library.root);

	// OpenUI, Gateway and Autofix skip schema limits, so we check them here.
	// TODO: when replies stream, validate once at the end. Regenerate or drop a bad program.
	return (program: string): string[] => {
		const { root, meta } = parser.parse(program);

		const incompleteProblems = meta.incomplete ? [INCOMPLETE_MESSAGE] : [];

		const parseProblems = meta.errors.map(({ component, path, message }) =>
			line(`${component}${path}`, message),
		);
		const undefinedProblems = meta.unresolved.map((name) =>
			line(name, UNDEFINED_MESSAGE),
		);
		const unusedProblems = meta.orphaned.map((name) =>
			line(name, UNUSED_MESSAGE),
		);

		return [
			...rootProblems(library, root),
			...incompleteProblems,
			...parseProblems,
			...undefinedProblems,
			...unusedProblems,
			...schemaProblems(library, root),
		];
	};
};
