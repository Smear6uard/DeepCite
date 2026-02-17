interface FileUploadOverlayProps {
  isDragging: boolean;
}

export function FileUploadOverlay({ isDragging }: FileUploadOverlayProps) {
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 bg-accent/10 backdrop-blur-sm z-50 flex items-center justify-center border-2 border-dashed border-accent">
      <div className="text-center text-accent text-sm tracking-[0.1em]">
        [DROP FILE]
      </div>
    </div>
  );
}
