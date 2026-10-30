import { Button } from "@thoth/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@thoth/ui/components/dropdown-menu";
import { ChevronDown, History } from "lucide-react";
import type { Conversation } from "../chat.schema";

type Props = {
	conversations: Conversation[];
	activeId: string;
	onSelect: (id: string) => void;
	onClear: () => void;
};

const ITEM_STYLE = "truncate px-2.5 py-1.5 max-sm:py-3";

export const HistoryMenu = ({
	conversations,
	activeId,
	onSelect,
	onClear,
}: Props) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="max-sm:h-11"
					disabled={conversations.length === 0}
				>
					<History />
					History
					<ChevronDown />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-64">
				{conversations.map((conversation) => (
					<DropdownMenuItem
						key={conversation.id}
						aria-current={conversation.id === activeId}
						className={`${ITEM_STYLE} aria-[current=true]:bg-muted`}
						onSelect={() => onSelect(conversation.id)}
					>
						{conversation.title}
					</DropdownMenuItem>
				))}

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className={`${ITEM_STYLE} text-muted-foreground`}
					onSelect={onClear}
				>
					Clear all history
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
