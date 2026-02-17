import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns initial value when nothing stored", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    // Before hydration
    expect(result.current[0]).toBe("default");
  });

  it("reads stored value after hydration", async () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default")
    );
    // After useEffect runs, it should have the stored value
    await vi.waitFor(() => {
      expect(result.current[2]).toBe(true); // isInitialized
    });
    expect(result.current[0]).toBe("stored-value");
  });

  it("writes to localStorage on setValue", async () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    await vi.waitFor(() => {
      expect(result.current[2]).toBe(true);
    });

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("test-key")!)).toBe("updated");
  });

  it("migrates from old storage key", async () => {
    localStorage.setItem(
      "ai-answer-engine-messages",
      JSON.stringify("old-data")
    );
    const { result } = renderHook(() =>
      useLocalStorage("deepcite-messages", "default")
    );

    await vi.waitFor(() => {
      expect(result.current[2]).toBe(true);
    });

    expect(result.current[0]).toBe("old-data");
    expect(localStorage.getItem("ai-answer-engine-messages")).toBeNull();
  });
});
