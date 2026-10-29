import {
	createSlice,
	type PayloadAction,
	type SliceCaseReducers,
	type ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

type Status = "idle" | "loading" | "succeeded" | "failed";

type GenericState<Data, Failure> = {
	status: Status;
	data: Data | null;
	error: Failure | null;
};

// A slice for one request. It adds started, succeeded, and failed to your own reducers.
export const createGenericSlice = <
	Data,
	Failure,
	Reducers extends SliceCaseReducers<GenericState<Data, Failure>>,
>({
	name,
	reducers,
}: {
	name: string;
	reducers: ValidateSliceCaseReducers<GenericState<Data, Failure>, Reducers>;
}) => {
	const initialState: GenericState<Data, Failure> = {
		status: "idle",
		data: null,
		error: null,
	};

	return createSlice({
		name,
		initialState,
		reducers: {
			...reducers,
			started: (state) => {
				state.status = "loading";
				state.error = null;
			},
			succeeded: (_state, action: PayloadAction<Data>) => {
				return { status: "succeeded", data: action.payload, error: null };
			},
			failed: (_state, action: PayloadAction<Failure>) => {
				return { status: "failed", data: null, error: action.payload };
			},
		},
	});
};
