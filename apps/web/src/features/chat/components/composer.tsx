import { Button } from "@thoth/ui/components/button";
import { Textarea } from "@thoth/ui/components/textarea";
import { SendHorizontal } from "lucide-react";
import { type FormEvent, type KeyboardEvent, useRef } from "react";
import { MAX_MESSAGE_LENGTH } from "../chat.schema";
import { CharacterCounter } from "./character-counter";

type Props = {
	owner: string;
	draft: string;
	canSend: boolean;
	onChange: (draft: string) => void;
	onSubmit: (event: FormEvent) => void;
};

// The ui textarea grows with its text, up to max-h.
const INPUT_STYLE =
	"max-h-32 min-h-11 flex-1 resize-none rounded-3xl bg-background px-4 py-2.5 leading-6 sm:min-h-10 sm:py-2";
const SEND_STYLE = "size-11 rounded-full sm:size-10";

export const Composer = ({
	owner,
	draft,
	canSend,
	onChange,
	onSubmit,
}: Props) => {
	const input = useRef<HTMLTextAreaElement>(null);

	const submit = (event: FormEvent) => {
		onSubmit(event);
		input.current?.focus();
	};

	const sendOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		const { key, shiftKey, nativeEvent } = event;
		const isPlainEnter =
			key === "Enter" && !shiftKey && !nativeEvent.isComposing;

		if (!isPlainEnter) {
			return;
		}

		event.preventDefault();
		event.currentTarget.form?.requestSubmit();
	};

	return (
		<form
			onSubmit={submit}
			className="relative flex items-end gap-2 border-t border-border p-3"
		>
			<CharacterCounter length={draft.length} max={MAX_MESSAGE_LENGTH} />

			<Textarea
				ref={input}
				rows={1}
				aria-label={`Ask about ${owner}`}
				placeholder="Ask a question…"
				value={draft}
				maxLength={MAX_MESSAGE_LENGTH}
				onChange={(event) => onChange(event.target.value)}
				onKeyDown={sendOnEnter}
				className={INPUT_STYLE}
			/>

			<Button
				type="submit"
				size="icon-lg"
				className={SEND_STYLE}
				aria-label="Send"
				disabled={!canSend}
			>
				<SendHorizontal />
			</Button>
		</form>
	);
};
