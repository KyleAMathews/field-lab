import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useRetainedValue } from "./useRetainedValue";

describe("useRetainedValue", () => {
	it("keeps the last value during a same-scope refresh", () => {
		const initialProps: { scope: string; value: string | undefined } = {
			scope: "field_log.md",
			value: "revision 1",
		};
		const { result, rerender } = renderHook(
			({ scope, value }: { scope: string; value: string | undefined }) =>
				useRetainedValue(scope, value),
			{ initialProps },
		);

		expect(result.current).toBe("revision 1");
		rerender({ scope: "field_log.md", value: undefined });
		expect(result.current).toBe("revision 1");
		rerender({ scope: "another.md", value: undefined });
		expect(result.current).toBeUndefined();
	});
});
