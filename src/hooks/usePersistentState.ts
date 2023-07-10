import { type Dispatch, type SetStateAction, useState, useEffect } from "react";

type LocalStoreData<T> = {
	state: T;
	dataType: "string" | "object" | "boolean" | "number" | "Date";
};

const getDataType = <T>(data: T): LocalStoreData<T>["dataType"] => {
	if (["symbol", "undefined", "function", "bigint"].includes(typeof data)) {
		throw new Error("Data type must be parseable");
	}

	const dataTypeRaw = typeof data as
		| "string"
		| "number"
		| "object"
		| "boolean";

	if (dataTypeRaw !== "object") {
		return dataTypeRaw;
	} else {
		if (data instanceof Date) {
			return "Date";
		} else {
			return "object";
		}
	}
};

/**
 * Superset of useState that stores the state in localStorage and keeps state synchronised between tabs.
 */
const usePersistentState = <T>(initialState: T, componentID: string) => {
	const [state, _setState] = useState(initialState);
	const [stateLoaded, setStateLoaded] = useState(false);

	useEffect(() => {
		const onVisibilityChange = () => {
			if (document.visibilityState == "visible") {
				const localValue = localStorage.getItem(componentID);

				if (localValue) {
					const parsed = JSON.parse(localValue) as LocalStoreData<T>;

					if (parsed.dataType === "Date") {
						parsed.state = new Date(parsed.state as string) as T;
					}

					_setState(parsed.state);
				}
			}
			if (!stateLoaded) {
				setStateLoaded(true);
			}
		};

		onVisibilityChange();

		document.addEventListener("visibilitychange", onVisibilityChange);

		return () => {
			document.removeEventListener(
				"visibilitychange",
				onVisibilityChange
			);
		};
	}, [componentID]); // eslint-disable-line

	const setState: Dispatch<SetStateAction<T>> = (newState) => {
		_setState((curr) => {
			const calcedState =
				typeof newState === "function"
					? (newState as (curr: T) => T)(curr)
					: state;

			localStorage.setItem(
				componentID,
				JSON.stringify({
					state: calcedState,
					dataType: getDataType(calcedState),
				} satisfies LocalStoreData<T>)
			);

			return calcedState;
		});
	};

	const returnArr = [state, setState, stateLoaded] as const;

	return returnArr;
};

export default usePersistentState;
