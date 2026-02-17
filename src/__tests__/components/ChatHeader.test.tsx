import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ChatHeader } from "@/components/chat/ChatHeader";

afterEach(cleanup);

describe("ChatHeader", () => {
  it("renders DEEPCITE title", () => {
    const { container } = render(
      <ChatHeader onExport={vi.fn()} onNewChat={vi.fn()} />
    );
    expect(container.querySelector("h1")?.textContent).toBe("DEEPCITE");
  });

  it("calls onExport when EXPORT clicked", () => {
    const onExport = vi.fn();
    const { container } = render(
      <ChatHeader onExport={onExport} onNewChat={vi.fn()} />
    );
    const buttons = container.querySelectorAll("button");
    // First button is EXPORT, second is NEW
    buttons[0].click();
    expect(onExport).toHaveBeenCalledOnce();
  });

  it("calls onNewChat when NEW clicked", () => {
    const onNewChat = vi.fn();
    const { container } = render(
      <ChatHeader onExport={vi.fn()} onNewChat={onNewChat} />
    );
    const buttons = container.querySelectorAll("button");
    buttons[1].click();
    expect(onNewChat).toHaveBeenCalledOnce();
  });
});
