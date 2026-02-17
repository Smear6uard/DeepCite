"use client";

import type { UploadedFile } from "@/types";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  uploadedFile: UploadedFile | null;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onFileSelect: () => void;
  onClearFile: () => void;
}

export function ChatInput({
  message,
  isLoading,
  uploadedFile,
  onMessageChange,
  onSend,
  onFileSelect,
  onClearFile,
}: ChatInputProps) {
  const canSend = message.trim() && !isLoading;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 sm:p-6">
      <div className="max-w-chat mx-auto flex gap-2 sm:gap-4 items-center">
        <button
          onClick={onFileSelect}
          disabled={isLoading}
          className={cn(
            "w-10 h-10 rounded-lg border border-border-light bg-transparent text-text-dim",
            "flex items-center justify-center transition-colors shrink-0",
            isLoading
              ? "opacity-50 cursor-default"
              : "cursor-pointer hover:border-border-hover hover:text-text-muted"
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
        </button>

        <div className="flex-1 relative">
          {uploadedFile && (
            <div className="absolute -top-7 left-0 text-[11px] text-accent flex items-center gap-2">
              <span>[FILE]</span>
              <span className="text-text-muted">{uploadedFile.filename}</span>
              <button
                onClick={onClearFile}
                className="bg-transparent border-none text-text-dim cursor-pointer p-0 text-xs hover:text-error transition-colors"
              >
                [&times;]
              </button>
            </div>
          )}
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            placeholder={
              uploadedFile ? "Query document..." : "Paste URL or ask a question"
            }
            disabled={isLoading}
            className={cn(
              "w-full px-4 py-3 bg-surface border border-border-light rounded-lg",
              "text-foreground text-sm font-mono outline-none transition-colors",
              "focus:border-border-hover",
              isLoading && "opacity-50"
            )}
          />
        </div>

        <button
          onClick={onSend}
          disabled={!canSend}
          className={cn(
            "px-6 py-3 rounded-lg text-xs font-semibold tracking-[0.1em] font-mono shrink-0 transition-all",
            canSend
              ? "bg-accent text-background cursor-pointer hover:bg-accent-hover hover:-translate-y-px hover:shadow-[0_4px_20px_var(--accent-glow)]"
              : "bg-border text-[#3a3a3a] cursor-default"
          )}
        >
          {isLoading ? "..." : "EXEC"}
        </button>
      </div>

      <div className="max-w-chat mx-auto mt-3 flex gap-6 justify-center">
        {["Multi-URL", "PDF & DOCX", "Local storage"].map((feature) => (
          <span
            key={feature}
            className="text-[10px] text-border-light tracking-[0.05em]"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}
