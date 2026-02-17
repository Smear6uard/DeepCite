import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import type { Message } from "@/types";

describe("ChatMessage", () => {
  it("renders user message", () => {
    const msg: Message = {
      role: "user",
      content: "Hello world",
      displayedContent: "Hello world",
      timestamp: Date.now(),
    };
    render(<ChatMessage message={msg} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText(/YOU/)).toBeInTheDocument();
  });

  it("renders AI message with SYSTEM label", () => {
    const msg: Message = {
      role: "ai",
      content: "Response text",
      displayedContent: "Response text",
      timestamp: Date.now(),
    };
    render(<ChatMessage message={msg} />);
    expect(screen.getByText("Response text")).toBeInTheDocument();
    expect(screen.getByText(/SYSTEM/)).toBeInTheDocument();
  });

  it("renders error message with error styling", () => {
    const msg: Message = {
      role: "ai",
      content: "[ERROR] Something failed",
      displayedContent: "[ERROR] Something failed",
      isError: true,
      timestamp: Date.now(),
    };
    render(<ChatMessage message={msg} />);
    expect(screen.getByText("[ERROR] Something failed")).toBeInTheDocument();
  });

  it("renders sources when present", () => {
    const msg: Message = {
      role: "ai",
      content: "Analysis complete",
      displayedContent: "Analysis complete",
      sources: [
        { url: "https://example.com", scraperUsed: "cheerio", error: null },
      ],
      timestamp: Date.now(),
    };
    render(<ChatMessage message={msg} />);
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
    expect(screen.getByText("[cheerio]")).toBeInTheDocument();
  });

  it("shows streaming indicator when streaming", () => {
    const msg: Message = {
      role: "ai",
      content: "Full content here",
      displayedContent: "Full con",
      isStreaming: true,
      timestamp: Date.now(),
    };
    render(<ChatMessage message={msg} />);
    expect(screen.getByText("[STREAMING...]")).toBeInTheDocument();
  });

  it("shows attachment badge", () => {
    const msg: Message = {
      role: "ai",
      content: "Analyzing document",
      displayedContent: "Analyzing document",
      attachment: { filename: "test.pdf", type: "pdf" },
      timestamp: Date.now(),
    };
    render(<ChatMessage message={msg} />);
    expect(screen.getByText("Analyzing: test.pdf")).toBeInTheDocument();
  });
});
