"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TYPEWRITER_SPEED, TYPEWRITER_CHUNK_SIZE } from "@/lib/constants";

interface UseTypewriterOptions {
  content: string;
  enabled: boolean;
  speed?: number;
  chunkSize?: number;
}

export function useTypewriter({
  content,
  enabled,
  speed = TYPEWRITER_SPEED,
  chunkSize = TYPEWRITER_CHUNK_SIZE,
}: UseTypewriterOptions) {
  const [displayedContent, setDisplayedContent] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef(content);

  // Track when content changes to reset
  useEffect(() => {
    if (content !== contentRef.current) {
      contentRef.current = content;
    }
  }, [content]);

  useEffect(() => {
    if (!enabled) {
      setDisplayedContent(content);
      return;
    }

    if (displayedContent.length < content.length) {
      timerRef.current = setTimeout(() => {
        setDisplayedContent(
          content.slice(0, displayedContent.length + chunkSize)
        );
      }, speed);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [content, displayedContent, enabled, speed, chunkSize]);

  const skipToEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setDisplayedContent(content);
  }, [content]);

  const isTyping = enabled && displayedContent.length < content.length;

  return { displayedContent, isTyping, skipToEnd };
}
