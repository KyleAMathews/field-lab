import { useEffect, useRef } from "react";

export function useRetainedValue<T>(
	scope: string,
	value: T | undefined,
): T | undefined {
	const retained = useRef<{ scope: string; value: T } | null>(null);

	useEffect(() => {
		if (value !== undefined) retained.current = { scope, value };
	}, [scope, value]);

	if (value !== undefined) return value;
	return retained.current?.scope === scope ? retained.current.value : undefined;
}
