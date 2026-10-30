import { getBio, Hero } from "~/features/bio/index";
import { Chat } from "~/features/chat/components/index";
import { Links, links } from "~/features/links/index";

// Seconds. The page is rebuilt in the background at most this often.
export const revalidate = 300;

// biome-ignore lint/style/noDefaultExport: Next.js requires a default export
export default async function Page() {
	const bio = await getBio();

	return (
		<main className="mx-auto flex h-dvh max-w-2xl flex-col items-center gap-6 overflow-y-auto px-6 py-8 text-center">
			<Hero bio={bio} />
			<Links links={links} />
			<Chat owner={bio.name} />
		</main>
	);
}
