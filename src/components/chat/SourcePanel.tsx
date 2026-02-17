import type { Source } from "@/types";
import { SourceCard } from "./SourceCard";

interface SourcePanelProps {
  sources: Source[];
}

export function SourcePanel({ sources }: SourcePanelProps) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="text-[10px] text-text-dim mb-2 tracking-[0.05em]">
        [SOURCES]
      </div>
      {sources.map((source, idx) => (
        <SourceCard key={idx} source={source} />
      ))}
    </div>
  );
}
