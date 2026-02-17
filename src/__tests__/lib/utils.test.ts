import { describe, it, expect } from "vitest";
import { formatTime, cn } from "@/lib/utils";

describe("formatTime", () => {
  it("formats a timestamp", () => {
    const ts = new Date("2024-01-15T14:30:45").getTime();
    const result = formatTime(ts);
    expect(result).toBe("14:30:45");
  });

  it("returns current time when no timestamp provided", () => {
    const result = formatTime();
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string for all falsy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});
