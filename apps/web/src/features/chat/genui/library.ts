import { createLibrary } from "@openuidev/react-lang";
import { GENUI_ROOT } from "@thoth/genui";
import { LinkRenderer } from "./components/link";
import { StackRenderer } from "./components/stack";
import { SuggestionsRenderer } from "./components/suggestions";

export const library = createLibrary({
	root: GENUI_ROOT,
	components: [StackRenderer, SuggestionsRenderer, LinkRenderer],
});
