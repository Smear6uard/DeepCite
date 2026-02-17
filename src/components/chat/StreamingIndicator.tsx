import { cn } from "@/lib/utils";

interface StreamingIndicatorProps {
  status: string | null;
  isVisible: boolean;
}

export function StreamingIndicator({
  status,
  isVisible,
}: StreamingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 text-[11px] text-text-dim tracking-[0.05em]">
      <span className={cn("inline-flex gap-[2px]")}>
        <span className="animate-pulse">.</span>
        <span className="animate-pulse [animation-delay:200ms]">.</span>
        <span className="animate-pulse [animation-delay:400ms]">.</span>
      </span>
      <span>{status || "Processing..."}</span>
    </div>
  );
}
