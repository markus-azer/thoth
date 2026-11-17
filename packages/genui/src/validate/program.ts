import { genuiLibrary } from "../library";
import { createValidator } from "./create-validator";

export const programProblems = createValidator(genuiLibrary);

export const isValidProgram = (program: string): boolean => {
	return programProblems(program).length === 0;
};
