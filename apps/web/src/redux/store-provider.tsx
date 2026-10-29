"use client";

import { type ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import type { AppConfig } from "./helpers/index";
import { type AppStore, makeStore } from "./store";

type Props = { config: AppConfig; children: ReactNode };

export const StoreProvider = ({ config, children }: Props) => {
	const store = useRef<AppStore>(null);

	if (!store.current) {
		store.current = makeStore(config);
	}

	return <Provider store={store.current}>{children}</Provider>;
};
