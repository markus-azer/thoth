import type { Bio } from "../bio.schema";

export function Hero({ bio }: { bio: Bio }) {
	return (
		<header className="flex flex-col gap-2">
			<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
				{bio.name}
			</h1>
			<p className="text-lg text-muted-foreground">{bio.headline}</p>
		</header>
	);
}
