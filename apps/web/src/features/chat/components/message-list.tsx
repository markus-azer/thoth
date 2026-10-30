import { isEmptyChat } from "../chat.history";
import type { Conversation } from "../chat.schema";
import { useScrollToEnd } from "../hooks/use-scroll-to-end";
import { Starters } from "./starters";
import { ThinkingBubble } from "./thinking-bubble";

type Props = {
	turns: Conversation["turns"];
	pending: boolean;
	notice: string | null;
	canPickStarter: boolean;
	onPickStarter: (question: string) => void;
};

// Reduced motion keeps everything still.
const ENTER_STYLE =
	"animate-in fade-in slide-in-from-bottom-1 duration-200 motion-reduce:animate-none";

// A short fade at both edges. The list padding keeps content clear of it.
const EDGE_FADE =
	"[mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-12px),transparent)]";

const LIST_STYLE = `flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4 animate-in fade-in duration-200 motion-reduce:animate-none ${EDGE_FADE}`;

const BUBBLE_STYLE = `max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap [overflow-wrap:anywhere] ${ENTER_STYLE}`;
const VISITOR_STYLE = `${BUBBLE_STYLE} self-end rounded-br-md bg-primary text-primary-foreground`;
const AGENT_STYLE = `${BUBBLE_STYLE} w-fit rounded-bl-md bg-muted`;
const NOTICE_STYLE =
	"rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive";

export const MessageList = ({
	turns,
	pending,
	notice,
	canPickStarter,
	onPickStarter,
}: Props) => {
	const list = useScrollToEnd(turns, pending);

	return (
		<div ref={list} aria-live="polite" className={LIST_STYLE}>
			{isEmptyChat(turns, pending) && (
				<Starters disabled={!canPickStarter} onPick={onPickStarter} />
			)}

			{turns.map((turn, index) => (
				<p
					// biome-ignore lint/suspicious/noArrayIndexKey: turns are append-only
					key={index}
					className={turn.role === "visitor" ? VISITOR_STYLE : AGENT_STYLE}
				>
					{turn.text}
				</p>
			))}

			{pending && <ThinkingBubble />}

			{notice && (
				<p role="alert" className={NOTICE_STYLE}>
					{notice}
				</p>
			)}
		</div>
	);
};
