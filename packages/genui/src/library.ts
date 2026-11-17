import { createLibrary } from "@openuidev/lang-core";
import { GENUI_COMPONENTS } from "./components/index";

export const GENUI_ROOT = "Stack";

export const genuiLibrary = createLibrary({
	root: GENUI_ROOT,
	components: GENUI_COMPONENTS,
});
