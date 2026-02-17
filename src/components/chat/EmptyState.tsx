interface EmptyStateProps {
  onSuggestionClick: (query: string) => void;
}

const suggestions = [
  "Summarize a URL",
  "Compare two sites",
  "Upload a PDF",
  "Ask anything",
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
        <h2 className="text-sm font-medium tracking-[0.1em] text-white">
          DEEPCITE
        </h2>
      </div>
      <p className="text-text-dim text-xs tracking-[0.05em] mb-8 max-w-sm">
        AI answer engine with source attribution. Paste a URL, upload a
        document, or ask a question.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestionClick(s)}
            className="text-[11px] px-3 py-1.5 border border-border-light rounded-md text-text-dim hover:text-text-muted hover:border-border-hover transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
