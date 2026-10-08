import { Button } from "@thoth/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import type { SiteLink } from "../links.data";

export function Links({ links }: { links: SiteLink[] }) {
	return (
		<nav aria-label="Links" className="flex flex-wrap gap-3">
			{links.map((link) => (
				<Button key={link.label} asChild variant="outline" size="lg">
					<a href={link.href}>
						{link.label}
						<ArrowUpRight data-icon="inline-end" />
					</a>
				</Button>
			))}
		</nav>
	);
}
