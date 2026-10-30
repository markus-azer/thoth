import { Button } from "@thoth/ui/components/button";
import { Plus } from "lucide-react";
import type { Conversation } from "../chat.schema";
import { HistoryMenu } from "./history-menu";

type Props = {
	owner: string;
	conversations: Conversation[];
	activeId: string;
	hasMessages: boolean;
	onSelect: (id: string) => void;
	onClear: () => void;
	onNewChat: () => void;
};

// Icon only on phones, so the header keeps one line and one shape.
const NEW_CHAT_STYLE = "max-sm:size-11 max-sm:px-0";

const titleFor = (owner: string) => {
	const [firstName] = owner.trim().split(/\s+/);

	return `${firstName}'s assistant`;
};

export const ChatHeader = ({
	owner,
	conversations,
	activeId,
	hasMessages,
	onSelect,
	onClear,
	onNewChat,
}: Props) => {
	return (
		<header className="relative flex items-center justify-between gap-2 border-b border-border px-3 py-2">
			<h2 className="min-w-0 truncate px-1 text-sm font-medium">
				{titleFor(owner)}
			</h2>

			<div className="flex shrink-0 items-center gap-2">
				<HistoryMenu
					conversations={conversations}
					activeId={activeId}
					onSelect={onSelect}
					onClear={onClear}
				/>

				<Button
					variant="outline"
					size="sm"
					className={NEW_CHAT_STYLE}
					aria-label="New chat"
					disabled={!hasMessages}
					onClick={onNewChat}
				>
					<Plus />
					<span className="max-sm:hidden">New chat</span>
				</Button>
			</div>
		</header>
	);
};
