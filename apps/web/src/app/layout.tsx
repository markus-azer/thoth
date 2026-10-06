import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { getBio } from "~/features/bio/index";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
	const bio = await getBio();
	return { title: bio.name, description: bio.headline };
}

// biome-ignore lint/style/noDefaultExport: Next.js requires a default export
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={geist.variable}>
			<body>{children}</body>
		</html>
	);
}
