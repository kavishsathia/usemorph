"use client";

interface UserMessageProps {
  content: string;
  timestamp: Date;
}

export default function UserMessage({ content, timestamp }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div className="bg-morph-blue/20 border border-morph-blue/30 px-4 py-3">
          <p className="text-morph-white text-sm whitespace-pre-wrap">
            {content}
          </p>
        </div>
        <span className="text-xs text-morph-white/30 mt-1 block text-right">
          {timestamp.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
