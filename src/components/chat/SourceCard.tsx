import type { Source } from "@/types";

interface SourceCardProps {
  source: Source;
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="flex items-center gap-2 text-[11px] mt-1">
      <span className={source.error ? "text-error" : "text-accent"}>
        {source.error ? "\u2717" : "\u2713"}
      </span>
      <span className="text-text-dim max-w-[400px] overflow-hidden text-ellipsis">
        {source.url}
      </span>
      {source.scraperUsed && (
        <span className="text-border-light text-[10px]">
          [{source.scraperUsed}]
        </span>
      )}
    </div>
  );
}
