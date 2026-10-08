import type { Bio } from "../bio.schema";

export function About({ bio }: { bio: Bio }) {
	return (
		<section aria-label="About">
			<p className="max-w-prose leading-relaxed">{bio.about}</p>
		</section>
	);
}
