import { About, getBio, Hero } from "~/features/bio/index";

// Seconds. The page is rebuilt in the background at most this often.
export const revalidate = 300;

// biome-ignore lint/style/noDefaultExport: Next.js requires a default export
export default async function Page() {
	const bio = await getBio();

	return (
		<main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-6 py-16">
			<Hero bio={bio} />
			<About bio={bio} />
		</main>
	);
}
