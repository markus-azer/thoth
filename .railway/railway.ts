import { defineRailway, project } from "railway/iac";
import { web } from "./services/web.ts";

export const partial = "web";

// biome-ignore lint/style/noDefaultExport: Railway requires a default export
export default defineRailway(() => project("thoth", { resources: [web()] }));
