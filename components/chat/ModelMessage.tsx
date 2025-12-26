"use client";

interface ModelMessageProps {
  content: string;
  timestamp: Date;
}

export default function ModelMessage({
  content,
  timestamp,
}: ModelMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-morph-blue">Morph</span>
        </div>
        <div className="bg-morph-panel border border-morph-border px-4 py-3">
          <p className="text-morph-white text-sm whitespace-pre-wrap">
            {content}
          </p>
        </div>
        <span className="text-xs text-morph-white/30 mt-1 block">
          {timestamp.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
