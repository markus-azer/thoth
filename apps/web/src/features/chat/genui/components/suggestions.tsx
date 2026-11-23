"use client";

import { useTriggerAction } from "@openuidev/react-lang";
import { Suggestions } from "@thoth/genui";
import { Button } from "@thoth/ui/components/button";
import { useContext } from "react";
import { GenuiContext } from "../genui-context";
import { withRenderer } from "../with-renderer";

const LIST_STYLE = "flex flex-wrap gap-2";

const SUGGESTION_STYLE =
	"h-auto whitespace-normal rounded-xl px-3 py-2 text-left text-sm font-normal";

export const SuggestionsRenderer = withRenderer(Suggestions, ({ props }) => {
	const continueConversation = useTriggerAction();
	const { interactive } = useContext(GenuiContext);

	return (
		<div className={LIST_STYLE}>
			{props.questions.map((question) => (
				<Button
					key={question}
					size="sm"
					variant="outline"
					className={SUGGESTION_STYLE}
					disabled={!interactive}
					onClick={() => continueConversation(question)}
				>
					{question}
				</Button>
			))}
		</div>
	);
});
