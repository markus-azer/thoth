import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StoreProvider } from "~/redux/store-provider";

const config = { apiUrl: "https://api.test", handle: "ada" };

export const renderWithStore = (node: ReactNode) => {
	return renderToStaticMarkup(
		<StoreProvider config={config}>{node}</StoreProvider>,
	);
};
