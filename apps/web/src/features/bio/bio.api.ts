import { cache } from "react";
import { env } from "~/env";
import { type Bio, BioSchema } from "./bio.schema";

export const getBio = cache(async (): Promise<Bio> => {
	const res = await fetch(`${env.API_URL}/bio/${env.SITE_HANDLE}`);
	if (!res.ok) {
		throw new Error(`Fetching bio failed with status ${res.status}`);
	}

	const body = await res.json();
	return BioSchema.parse(body);
});
