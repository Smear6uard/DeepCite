"use client";

import { useState, useCallback, useRef } from "react";
import type { Message, UploadedFile } from "@/types";
import { ALLOWED_FILE_TYPES } from "@/lib/constants";

interface UseFileUploadOptions {
  onMessage: (msg: Message) => void;
  setIsLoading: (loading: boolean) => void;
}

export function useFileUpload({ onMessage, setIsLoading }: UseFileUploadOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        onMessage({
          role: "ai",
          content: "[ERROR] Invalid file type. Accepted formats: PDF, DOCX",
          displayedContent:
            "[ERROR] Invalid file type. Accepted formats: PDF, DOCX",
          isError: true,
          timestamp: Date.now(),
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        onMessage({
          role: "ai",
          content: "[ERROR] File exceeds 10MB limit.",
          displayedContent: "[ERROR] File exceeds 10MB limit.",
          isError: true,
          timestamp: Date.now(),
        });
        return;
      }

      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setUploadedFile({
          content: data.content,
          filename: data.filename,
          type: data.type,
        });

        const successMsg = `[UPLOAD] ${data.filename}\nType: ${data.type.toUpperCase()}${data.pageCount ? ` | Pages: ${data.pageCount}` : ""}\nStatus: Ready for analysis`;
        onMessage({
          role: "ai",
          content: successMsg,
          displayedContent: successMsg,
          attachment: { filename: data.filename, type: data.type },
          timestamp: Date.now(),
        });
      } catch (error) {
        const errorMsg = `[ERROR] Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`;
        onMessage({
          role: "ai",
          content: errorMsg,
          displayedContent: errorMsg,
          isError: true,
          timestamp: Date.now(),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [onMessage, setIsLoading]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const clearFile = useCallback(() => setUploadedFile(null), []);

  return {
    isDragging,
    uploadedFile,
    setUploadedFile,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearFile,
    fileInputRef,
  };
}
