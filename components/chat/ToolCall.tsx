"use client";

import { Wrench } from "lucide-react";

interface ToolCallProps {
  toolName: string;
  args: Record<string, unknown>;
  timestamp: Date;
}

export default function ToolCall({ toolName, args, timestamp }: ToolCallProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%]">
        <div className="flex items-center gap-2 px-3 py-2 bg-morph-dark border border-morph-border/50">
          <Wrench size={14} className="text-morph-white/40" />
          <span className="text-xs font-mono text-morph-white/60">
            Calling {toolName}
          </span>
          <span className="text-xs text-morph-white/30">
            {timestamp.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
