import { Sparkles } from "lucide-react";

const BUBBLE_STYLE =
	"flex w-fit items-center gap-2 rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-sm";

// A light band sweeps across the text. Reduced motion keeps it still.
const SHIMMER_STYLE =
	"animate-shimmer bg-[length:200%_100%] bg-[linear-gradient(90deg,var(--color-muted-foreground)_35%,var(--color-foreground)_50%,var(--color-muted-foreground)_65%)] bg-clip-text text-transparent motion-reduce:animate-none";

export const ThinkingBubble = () => {
	return (
		<output aria-label="The agent is thinking" className={BUBBLE_STYLE}>
			<Sparkles className="size-4 text-muted-foreground motion-safe:animate-pulse" />
			<span className={SHIMMER_STYLE}>Thinking…</span>
		</output>
	);
};
