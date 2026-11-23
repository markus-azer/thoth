"use client";

import { BuiltinActionType, Renderer } from "@openuidev/react-lang";
import { GenuiContext } from "./genui-context";
import { library } from "./library";

type Props = {
	program: string;
	interactive: boolean;
	onContinue: (message: string) => void;
};

export const GenuiView = ({ program, interactive, onContinue }: Props) => (
	<GenuiContext.Provider value={{ interactive }}>
		<Renderer
			response={program}
			library={library}
			onAction={(event) => {
				if (event.type === BuiltinActionType.ContinueConversation) {
					onContinue(event.humanFriendlyMessage);
				}
			}}
		/>
	</GenuiContext.Provider>
);
