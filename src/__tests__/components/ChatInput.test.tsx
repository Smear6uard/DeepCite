import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { ChatInput } from "@/components/chat/ChatInput";

afterEach(cleanup);

const defaultProps = () => ({
  message: "",
  isLoading: false,
  uploadedFile: null,
  onMessageChange: vi.fn(),
  onSend: vi.fn(),
  onFileSelect: vi.fn(),
  onClearFile: vi.fn(),
});

describe("ChatInput", () => {
  it("renders input with placeholder", () => {
    const { container } = render(<ChatInput {...defaultProps()} />);
    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe("Paste URL or ask a question");
  });

  it("calls onMessageChange on input", () => {
    const props = defaultProps();
    const { container } = render(<ChatInput {...props} />);
    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "hello" } });
    expect(props.onMessageChange).toHaveBeenCalledWith("hello");
  });

  it("calls onSend on Enter key", () => {
    const props = defaultProps();
    props.message = "test";
    const { container } = render(<ChatInput {...props} />);
    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    fireEvent.keyDown(input, { key: "Enter" });
    expect(props.onSend).toHaveBeenCalledOnce();
  });

  it("shows loading indicator when loading", () => {
    const props = defaultProps();
    props.isLoading = true;
    props.message = "test";
    const { container } = render(<ChatInput {...props} />);
    const buttons = container.querySelectorAll("button");
    const execBtn = buttons[buttons.length - 1];
    expect(execBtn.textContent).toBe("...");
  });

  it("shows EXEC when not loading with message", () => {
    const props = defaultProps();
    props.message = "test";
    const { container } = render(<ChatInput {...props} />);
    const buttons = container.querySelectorAll("button");
    const execBtn = buttons[buttons.length - 1];
    expect(execBtn.textContent).toBe("EXEC");
  });

  it("shows document placeholder when file uploaded", () => {
    const props = {
      ...defaultProps(),
      uploadedFile: { content: "test", filename: "test.pdf", type: "pdf" },
    };
    const { container } = render(<ChatInput {...props} />);
    const input = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    expect(input.placeholder).toBe("Query document...");
  });
});
