import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// biome-ignore lint/style/noDefaultExport: Next.js requires a default export
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={geist.variable}>
			<body>{children}</body>
		</html>
	);
}
