import { useEffect, useRef } from "react";
import { isEmptyChat } from "../chat.history";
import type { Conversation } from "../chat.schema";

export const useScrollToEnd = (
	turns: Conversation["turns"],
	pending: boolean,
) => {
	const list = useRef<HTMLDivElement>(null);
	const hasScrolled = useRef(false);

	useEffect(() => {
		if (!list.current || isEmptyChat(turns, pending)) {
			return;
		}

		// A conversation opens at its end. Only new messages scroll smoothly.
		const behavior = hasScrolled.current ? "smooth" : "instant";

		list.current.scrollTo({ top: list.current.scrollHeight, behavior });
		hasScrolled.current = true;
	}, [turns, pending]);

	return list;
};
