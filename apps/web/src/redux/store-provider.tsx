"use client";

import { type ReactNode, useRef } from "react";
import {
	Provider,
	useDispatch as useReduxDispatch,
	useSelector as useReduxSelector,
} from "react-redux";
import type { AppConfig } from "./helpers/index";
import {
	type AppDispatch,
	type AppStore,
	makeStore,
	type RootState,
} from "./store";

export const useDispatch = useReduxDispatch.withTypes<AppDispatch>();
export const useSelector = useReduxSelector.withTypes<RootState>();

type Props = { config: AppConfig; children: ReactNode };

export const StoreProvider = ({ config, children }: Props) => {
	const store = useRef<AppStore>(null);

	if (!store.current) {
		store.current = makeStore(config);
	}

	return <Provider store={store.current}>{children}</Provider>;
};
