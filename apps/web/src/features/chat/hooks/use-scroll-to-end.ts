import { useLayoutEffect, useRef } from "react";
import { isEmptyChat } from "../chat.history";
import type { Conversation } from "../chat.schema";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export const useScrollToEnd = (
	turns: Conversation["turns"],
	pending: boolean,
) => {
	const list = useRef<HTMLDivElement>(null);
	const hasScrolled = useRef(false);

	useLayoutEffect(() => {
		if (!list.current || isEmptyChat(turns, pending)) {
			return;
		}

		// A conversation opens at its end. Only new messages scroll smoothly.
		const isSmooth =
			hasScrolled.current && !window.matchMedia(REDUCED_MOTION).matches;
		const behavior = isSmooth ? "smooth" : "instant";

		list.current.scrollTo({ top: list.current.scrollHeight, behavior });
		hasScrolled.current = true;
	}, [turns, pending]);

	return list;
};
