"use client";

import { useChat } from "@/hooks/useChat";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyState } from "@/components/chat/EmptyState";
import { FileUploadOverlay } from "@/components/chat/FileUploadOverlay";
import { StreamingIndicator } from "@/components/chat/StreamingIndicator";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { GREETING } from "@/lib/constants";

export default function Home() {
  const chat = useChat();
  const fileUpload = useFileUpload({
    onMessage: chat.addMessage,
    setIsLoading: chat.setIsLoading,
  });
  const scrollRef = useAutoScroll([chat.messages]);

  if (!chat.isInitialized) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-sm text-text-dim">INITIALIZING...</div>
      </div>
    );
  }

  const hasConversation =
    chat.messages.length > 1 ||
    (chat.messages.length === 1 && chat.messages[0].content !== GREETING);

  return (
    <div
      className="h-screen bg-background text-foreground font-mono relative overflow-x-hidden overflow-y-auto"
      onDragOver={fileUpload.handleDragOver}
      onDragLeave={fileUpload.handleDragLeave}
      onDrop={fileUpload.handleDrop}
    >
      <GrainOverlay />
      <FileUploadOverlay isDragging={fileUpload.isDragging} />

      <input
        ref={fileUpload.fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={(e) =>
          e.target.files?.[0] && fileUpload.handleFileUpload(e.target.files[0])
        }
        className="hidden"
      />

      <ChatHeader
        onExport={chat.handleExport}
        onNewChat={chat.handleNewChat}
      />

      <div className="max-w-chat mx-auto px-4 sm:px-6 relative pb-[200px]">
        {!hasConversation ? (
          <EmptyState onSuggestionClick={(q) => chat.setMessage(q)} />
        ) : (
          <div className="flex flex-col gap-8 mb-20">
            {chat.messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            <StreamingIndicator
              status={chat.streamingStatus}
              isVisible={chat.isLoading && !!chat.streamingStatus}
            />
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      <ChatInput
        message={chat.message}
        isLoading={chat.isLoading}
        uploadedFile={fileUpload.uploadedFile}
        onMessageChange={chat.setMessage}
        onSend={() =>
          chat.handleSend(fileUpload.uploadedFile, fileUpload.clearFile)
        }
        onFileSelect={() => fileUpload.fileInputRef.current?.click()}
        onClearFile={fileUpload.clearFile}
      />
    </div>
  );
}
