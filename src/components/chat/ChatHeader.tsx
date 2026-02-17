"use client";

interface ChatHeaderProps {
  onExport: () => void;
  onNewChat: () => void;
}

export function ChatHeader({ onExport, onNewChat }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 bg-background z-[100] w-full pt-4 pb-6 border-b border-border mb-8 sm:mb-16">
      <div className="max-w-chat mx-auto px-4 sm:px-6 flex justify-between items-baseline">
        <div className="flex items-baseline gap-3">
          <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent-glow)]" />
          <h1 className="text-sm font-medium tracking-[0.1em] text-white">
            DEEPCITE
          </h1>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onExport}
            className="bg-transparent border-none text-text-dim text-[11px] tracking-[0.05em] cursor-pointer py-1 hover:text-text-muted transition-colors"
          >
            EXPORT
          </button>
          <button
            onClick={onNewChat}
            className="bg-transparent border-none text-text-dim text-[11px] tracking-[0.05em] cursor-pointer py-1 hover:text-text-muted transition-colors"
          >
            NEW
          </button>
        </div>
      </div>
    </header>
  );
}
