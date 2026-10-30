type Props = {
	length: number;
	max: number;
};

const SHOW_FROM_RATIO = 0.8;

const COUNTER_STYLE =
	"absolute -top-3 right-5 rounded-full border border-border bg-card px-2 text-xs";

export const CharacterCounter = ({ length, max }: Props) => {
	if (length < max * SHOW_FROM_RATIO) {
		return null;
	}

	const color = length >= max ? "text-destructive" : "text-muted-foreground";

	return (
		<span className={`${COUNTER_STYLE} ${color}`}>
			{length}/{max}
		</span>
	);
};
