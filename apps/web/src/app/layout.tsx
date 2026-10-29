import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { env } from "~/env";
import { getBio } from "~/features/bio/index";
import { StoreProvider } from "~/redux/index";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
	const bio = await getBio();
	return { title: bio.name, description: bio.headline };
}

// biome-ignore lint/style/noDefaultExport: Next.js requires a default export
export default function RootLayout({ children }: { children: ReactNode }) {
	const config = {
		apiUrl: env.PUBLIC_API_URL,
		handle: env.SITE_HANDLE,
	};

	return (
		<html lang="en" className={geist.variable}>
			<body>
				<StoreProvider config={config}>{children}</StoreProvider>
			</body>
		</html>
	);
}
