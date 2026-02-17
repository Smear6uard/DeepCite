"use client";

import { useState, useCallback, useRef } from "react";
import type { Message, UploadedFile } from "@/types";
import { STORAGE_KEY, GREETING, MAX_DOC_LENGTH } from "@/lib/constants";
import { useLocalStorage } from "./useLocalStorage";

export function useChat() {
  const [savedMessages, setSavedMessages, isInitialized] = useLocalStorage<
    Message[]
  >(STORAGE_KEY, []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasHydrated = useRef(false);

  // Hydrate messages from localStorage on first init
  if (isInitialized && !hasHydrated.current) {
    hasHydrated.current = true;
    if (savedMessages.length > 0) {
      const restored = savedMessages.map((msg) => ({
        ...msg,
        displayedContent: msg.content,
        isStreaming: false,
      }));
      setMessages(restored);
    } else {
      setMessages([
        {
          role: "ai" as const,
          content: GREETING,
          displayedContent: GREETING,
          timestamp: Date.now(),
        },
      ]);
    }
  }

  const persistMessages = useCallback(
    (msgs: Message[]) => {
      const toSave = msgs
        .filter((m) => !m.isStreaming)
        .map(({ role, content, isError, sources, attachment, timestamp }) => ({
          role,
          content,
          isError,
          sources,
          attachment,
          timestamp,
        }));
      setSavedMessages(toSave as Message[]);
    },
    [setSavedMessages]
  );

  const addMessage = useCallback(
    (msg: Message) => {
      setMessages((prev) => {
        const next = [...prev, msg];
        persistMessages(next);
        return next;
      });
    },
    [persistMessages]
  );

  const handleSend = useCallback(
    async (uploadedFile: UploadedFile | null, clearFile: () => void) => {
      if (!message.trim() || isLoading) return;

      const userMessage: Message = {
        role: "user",
        content: message,
        displayedContent: message,
        timestamp: Date.now(),
      };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      const currentMessage = message;
      setMessage("");
      setIsLoading(true);
      setStreamingStatus(null);

      const streamingMessage: Message = {
        role: "ai",
        content: "",
        displayedContent: "",
        isStreaming: true,
        attachment: uploadedFile
          ? { filename: uploadedFile.filename, type: uploadedFile.type }
          : undefined,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, streamingMessage]);

      abortControllerRef.current = new AbortController();

      let messageToSend = currentMessage;
      if (uploadedFile) {
        let documentContent = uploadedFile.content;

        if (documentContent.length > MAX_DOC_LENGTH) {
          const firstPart = documentContent.slice(
            0,
            Math.floor(MAX_DOC_LENGTH * 0.6)
          );
          const lastPart = documentContent.slice(
            -Math.floor(MAX_DOC_LENGTH * 0.2)
          );
          documentContent = `${firstPart}\n\n[... ${documentContent.length - firstPart.length - lastPart.length} characters truncated ...]\n\n${lastPart}`;
        }

        messageToSend = `[Analyzing uploaded document: ${uploadedFile.filename}]\n\nDocument content:\n${documentContent}\n\nUser question: ${currentMessage}`;
        clearFile();
      }

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageToSend,
            history: updatedMessages,
            stream: true,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = `[ERROR] ${errorData.error || `Request failed: ${response.status}`}`;
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: "ai",
              content: errorMessage,
              displayedContent: errorMessage,
              isError: true,
              isStreaming: false,
              timestamp: Date.now(),
            };
            persistMessages(newMessages);
            return newMessages;
          });
          return;
        }

        const sourcesHeader = response.headers.get("X-Sources");
        let sources: Message["sources"];
        if (sourcesHeader) {
          try {
            sources = JSON.parse(sourcesHeader);
          } catch {
            sources = undefined;
          }
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder("utf-8");
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // Check for structured events
          if (chunk.startsWith('{"type":')) {
            try {
              const event = JSON.parse(chunk);
              if (event.type === "status") {
                setStreamingStatus(event.message);
                continue;
              }
              if (event.type === "sources") {
                sources = event.data;
                continue;
              }
              if (event.type === "content") {
                fullContent += event.text;
              }
            } catch {
              // Not valid JSON, treat as raw text
              fullContent += chunk;
            }
          } else {
            fullContent += chunk;
          }

          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (lastIndex >= 0 && newMessages[lastIndex].role === "ai") {
              newMessages[lastIndex] = {
                role: "ai",
                content: fullContent,
                displayedContent: newMessages[lastIndex].displayedContent || "",
                isStreaming: true,
                sources,
                attachment: newMessages[lastIndex].attachment,
                timestamp: newMessages[lastIndex].timestamp,
              };
            }
            return newMessages;
          });
        }

        setStreamingStatus(null);
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (lastIndex >= 0 && newMessages[lastIndex].role === "ai") {
            newMessages[lastIndex] = {
              role: "ai",
              content: fullContent,
              displayedContent: fullContent,
              isStreaming: false,
              sources,
              attachment: newMessages[lastIndex].attachment,
              timestamp: newMessages[lastIndex].timestamp,
            };
          }
          persistMessages(newMessages);
          return newMessages;
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }
        const errorMsg = "[ERROR] Connection failed. Check network and retry.";
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "ai",
            content: errorMsg,
            displayedContent: errorMsg,
            isError: true,
            isStreaming: false,
            timestamp: Date.now(),
          };
          persistMessages(newMessages);
          return newMessages;
        });
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [message, messages, isLoading, persistMessages]
  );

  const handleNewChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const greeting: Message = {
      role: "ai",
      content: GREETING,
      displayedContent: GREETING,
      timestamp: Date.now(),
    };
    setMessages([greeting]);
    setMessage("");
    setIsLoading(false);
    setStreamingStatus(null);
    persistMessages([greeting]);
  }, [persistMessages]);

  const handleExport = useCallback(() => {
    const timestamp = new Date().toISOString().split("T")[0];
    const content =
      `# DeepCite - Chat Export\n_${timestamp}_\n\n---\n\n` +
      messages
        .map((msg) => {
          const role = msg.role === "ai" ? "## [SYSTEM]" : "## [USER]";
          const text = msg.content;
          const sources = msg.sources?.length
            ? `\n\n> Sources: ${msg.sources.map((s) => s.url).join(", ")}`
            : "";
          return `${role}\n\`\`\`\n${text}\n\`\`\`${sources}`;
        })
        .join("\n\n---\n\n");
    const filename = `deepcite-export-${timestamp}.md`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages]);

  return {
    messages,
    message,
    isLoading,
    isInitialized,
    streamingStatus,
    setMessage,
    setIsLoading,
    addMessage,
    handleSend,
    handleNewChat,
    handleExport,
  };
}
