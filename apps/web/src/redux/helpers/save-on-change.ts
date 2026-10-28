import type { Store } from "@reduxjs/toolkit";

// Saves the selected value each time it changes. An undefined value means not ready.
export const saveOnChange = <State, Value>(
	store: Pick<Store<State>, "getState" | "subscribe">,
	select: (state: State) => Value | undefined,
	save: (value: Value) => void,
) => {
	let saved = select(store.getState());

	store.subscribe(() => {
		const value = select(store.getState());

		if (value === undefined || value === saved) {
			return;
		}

		// The first value was just loaded, so it is already in storage.
		const isBaseline = saved === undefined;

		saved = value;

		if (isBaseline) {
			return;
		}

		save(value);
	});
};
