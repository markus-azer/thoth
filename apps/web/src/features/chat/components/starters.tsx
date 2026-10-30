import { Button } from "@thoth/ui/components/button";

type Props = {
	disabled: boolean;
	onPick: (question: string) => void;
};

const TOPICS = [
	{ label: "Quick intro", question: "Give me a short intro." },
	{ label: "Get in touch", question: "How can I get in touch?" },
];

const INVITATION = {
	label: "What can I ask?",
	question: "What can I ask you?",
};

const CHIP_STYLE = "h-auto rounded-xl px-3 py-3 text-sm font-normal";
const INVITATION_STYLE = `${CHIP_STYLE} col-span-full`;

// Two chips side by side. Stacked only below 22rem.
const GRID_STYLE = "grid w-full grid-cols-2 gap-2 max-[22rem]:grid-cols-1";

export const Starters = ({ disabled, onPick }: Props) => {
	return (
		<div className="my-auto flex animate-in flex-col items-center gap-4 text-center fade-in duration-300 motion-reduce:animate-none">
			<p className="text-sm text-muted-foreground">Not sure where to start?</p>

			<div className={GRID_STYLE}>
				{TOPICS.map((topic) => (
					<Button
						key={topic.label}
						variant="outline"
						className={CHIP_STYLE}
						disabled={disabled}
						onClick={() => onPick(topic.question)}
					>
						{topic.label}
					</Button>
				))}

				<Button
					variant="secondary"
					className={INVITATION_STYLE}
					disabled={disabled}
					onClick={() => onPick(INVITATION.question)}
				>
					{INVITATION.label}
				</Button>
			</div>
		</div>
	);
};
