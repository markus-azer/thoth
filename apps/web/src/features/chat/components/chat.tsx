"use client";

import type { FormEvent } from "react";
import { useChat } from "../hooks/use-chat";
import { ChatHeader } from "./chat-header";
import { Composer } from "./composer";
import { MessageList } from "./message-list";

const CARD_STYLE =
	"flex min-h-[26rem] w-full flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm";

export const Chat = ({ owner }: { owner: string }) => {
	const chat = useChat();

	const submit = (event: FormEvent) => {
		event.preventDefault();
		void chat.send(chat.draft);
	};

	return (
		<section aria-label="Chat" className={CARD_STYLE}>
			<ChatHeader
				owner={owner}
				conversations={chat.conversations}
				activeId={chat.activeId}
				hasMessages={chat.turns.length > 0}
				onSelect={chat.select}
				onClear={chat.clearHistory}
				onNewChat={chat.startNewChat}
			/>

			<MessageList
				key={chat.activeId}
				turns={chat.turns}
				pending={chat.pending}
				notice={chat.notice}
				onPickStarter={chat.send}
			/>

			<Composer
				owner={owner}
				draft={chat.draft}
				canSend={chat.canSend}
				onChange={chat.changeDraft}
				onSubmit={submit}
			/>
		</section>
	);
};
