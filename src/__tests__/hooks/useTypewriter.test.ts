import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypewriter } from "@/hooks/useTypewriter";

describe("useTypewriter", () => {
  it("shows full content when disabled", () => {
    const { result } = renderHook(() =>
      useTypewriter({
        content: "Hello world",
        enabled: false,
      })
    );
    expect(result.current.displayedContent).toBe("Hello world");
    expect(result.current.isTyping).toBe(false);
  });

  it("starts with empty when enabled", () => {
    const { result } = renderHook(() =>
      useTypewriter({
        content: "Hello",
        enabled: true,
        speed: 10,
        chunkSize: 1,
      })
    );
    expect(result.current.displayedContent).toBe("");
    expect(result.current.isTyping).toBe(true);
  });

  it("skips to end", async () => {
    const { result } = renderHook(() =>
      useTypewriter({
        content: "Hello world",
        enabled: true,
        speed: 1000,
        chunkSize: 1,
      })
    );

    act(() => {
      result.current.skipToEnd();
    });

    expect(result.current.displayedContent).toBe("Hello world");
    expect(result.current.isTyping).toBe(false);
  });

  it("progressively reveals content", async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useTypewriter({
        content: "Hi",
        enabled: true,
        speed: 10,
        chunkSize: 1,
      })
    );

    expect(result.current.displayedContent).toBe("");

    await act(async () => {
      vi.advanceTimersByTime(15);
    });

    expect(result.current.displayedContent).toBe("H");

    await act(async () => {
      vi.advanceTimersByTime(15);
    });

    expect(result.current.displayedContent).toBe("Hi");
    expect(result.current.isTyping).toBe(false);

    vi.useRealTimers();
  });
});
