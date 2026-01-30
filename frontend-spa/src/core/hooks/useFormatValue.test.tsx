import { renderHook } from "@testing-library/react";
import { useFormatValue } from "./useFormatValue";

describe("useFormatValue", () => {
  it("formats numbers as COP currency", () => {
    const { result } = renderHook(() => useFormatValue());

    expect(
      result.current.formatValue(125000).toString().replace(/\s/g, " "),
    ).toBe("$ 125.000");
    expect(
      result.current.formatValue(3200000).toString().replace(/\s/g, " "),
    ).toBe("$ 3.200.000");
  });

  it("formats numeric strings correctly", () => {
    const { result } = renderHook(() => useFormatValue());

    expect(
      result.current.formatValue("200000").toString().replace(/\s/g, " "),
    ).toBe("$ 200.000");
  });

  it("returns 0 formatted when value is undefined", () => {
    const { result } = renderHook(() => useFormatValue());

    expect(result.current.formatValue().toString().replace(/\s/g, " ")).toBe(
      "$ 0",
    );
  });

  it("returns original value when it is not a number", () => {
    const { result } = renderHook(() => useFormatValue());

    expect(result.current.formatValue("abc")).toBe("abc");
  });

  it("handles NaN values safely", () => {
    const { result } = renderHook(() => useFormatValue());

    expect(`${result.current.formatValue(NaN)}`.replace(/\s/g, " ")).toBe(
      "$ 0",
    );
  });
});
