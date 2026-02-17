import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the env module before importing groqClient
vi.mock("@/env", () => ({
  env: { GROQ_API_KEY: "test-key" },
}));

// Mock groq-sdk with a class constructor
vi.mock("groq-sdk", () => {
  class MockGroq {
    chat = {
      completions: {
        create: vi.fn(),
      },
    };
  }
  return { default: MockGroq };
});

describe("groqClient", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("exports getGroqResponse function", async () => {
    const mod = await import("@/lib/groqClient");
    expect(typeof mod.getGroqResponse).toBe("function");
  });

  it("exports getGroqStreamResponse function", async () => {
    const mod = await import("@/lib/groqClient");
    expect(typeof mod.getGroqStreamResponse).toBe("function");
  });
});
