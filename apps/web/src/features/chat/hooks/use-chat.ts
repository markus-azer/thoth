import { useEffect } from "react";
import {
	clearHistory,
	draftChanged,
	isPending,
	loadHistory,
	selected,
	sendQuestion,
	startedNewChat,
	useDispatch,
	useSelector,
	visibleTurns,
} from "~/redux/index";
import { toMessage } from "../chat.schema";

export const useChat = () => {
	const dispatch = useDispatch();
	const chat = useSelector((state) => state.chat);
	const { conversations, activeId, draft, notice, asking } = chat;

	const hasText = toMessage(draft) !== null;
	const isIdle = asking === null;

	useEffect(() => {
		dispatch(loadHistory());
	}, [dispatch]);

	return {
		conversations,
		activeId,
		draft,
		notice,
		turns: visibleTurns(chat),
		pending: isPending(chat),
		isIdle,
		canSend: hasText && isIdle,
		send: (text: string) => dispatch(sendQuestion(text)),
		changeDraft: (value: string) => dispatch(draftChanged(value)),
		select: (id: string) => dispatch(selected(id)),
		startNewChat: () => dispatch(startedNewChat()),
		clearHistory: () => dispatch(clearHistory()),
	};
};
