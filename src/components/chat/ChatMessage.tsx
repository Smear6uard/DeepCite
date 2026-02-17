"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/types";
import { formatTime, cn } from "@/lib/utils";
import { SourcePanel } from "./SourcePanel";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message: msg }: ChatMessageProps) {
  const displayContent = msg.isStreaming
    ? msg.displayedContent || ""
    : msg.displayedContent || msg.content;

  return (
    <div className="flex gap-6 items-start">
      <span className="text-[11px] text-border-light font-mono min-w-[64px] pt-[2px] hidden sm:block">
        {formatTime(msg.timestamp)}
      </span>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-[10px] tracking-[0.15em] mb-2 font-medium flex items-center gap-3",
            msg.role === "user"
              ? "text-accent"
              : msg.isError
                ? "text-error"
                : "text-text-dim"
          )}
        >
          <span>{msg.role === "user" ? "\u25b8 YOU" : "\u25c6 SYSTEM"}</span>
          {msg.isStreaming && (
            <span className="text-text-dim">[STREAMING...]</span>
          )}
          {msg.attachment && (
            <span className="text-[9px] text-accent bg-accent/10 px-2 py-0.5 rounded-xl tracking-[0.05em]">
              Analyzing: {msg.attachment.filename}
            </span>
          )}
        </div>

        <div
          className={cn(
            "text-sm leading-[1.8] max-w-[640px] font-mono",
            msg.role === "user"
              ? "text-white"
              : msg.isError
                ? "text-error"
                : "text-[#d4d4d4]",
            msg.isError &&
              "bg-error/[0.08] border-l-2 border-accent px-4 py-3 rounded mt-1"
          )}
        >
          {msg.role === "ai" && !msg.isError ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                strong: ({ children }) => (
                  <strong className="text-white font-semibold">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
                ),
                code: ({ className, children }) => {
                  const isBlock = className?.includes("language-");
                  return isBlock ? (
                    <code className="block bg-surface border border-border rounded p-3 my-3 text-xs overflow-x-auto">
                      {children}
                    </code>
                  ) : (
                    <code className="bg-surface px-1.5 py-0.5 rounded text-xs text-accent">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <pre className="my-0">{children}</pre>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-accent-hover transition-colors"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-border-light pl-4 text-text-muted italic my-3">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {displayContent}
            </ReactMarkdown>
          ) : (
            <div className="whitespace-pre-wrap">{displayContent}</div>
          )}
          {msg.isStreaming && msg.displayedContent !== msg.content && (
            <span className="inline-block w-[2px] h-3.5 bg-accent ml-0.5 animate-blink" />
          )}
        </div>

        {msg.sources &&
          msg.sources.length > 0 &&
          !msg.isStreaming && <SourcePanel sources={msg.sources} />}
      </div>
    </div>
  );
}
