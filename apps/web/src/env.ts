import { env as source } from "node:process";
import { cleanEnv, str, url } from "envalid";

// Read at build time and again at runtime, when pages are rebuilt in the background.
// The process exits if either is missing.
export const env = cleanEnv(source, {
	API_URL: url(),
	SITE_HANDLE: str(),
});
