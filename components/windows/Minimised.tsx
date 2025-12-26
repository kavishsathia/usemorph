import { InferSelectModel } from "drizzle-orm";
import { Minus } from "lucide-react";
import { windows } from "@/db/schema";

type Window = InferSelectModel<typeof windows>;

export default function Minimised({
  minimisedWindows,
  onUnminimise,
}: {
  minimisedWindows: Window[];
  onUnminimise: (windowId: string) => void;
}) {
  if (minimisedWindows.length === 0) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-2 bg-morph-dark/80 backdrop-blur-sm border-b border-morph-border">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {minimisedWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => onUnminimise(window.id)}
            className="flex items-center gap-2 px-3 py-1.5 bg-morph-panel border border-morph-border hover:border-morph-blue/50 transition-colors shrink-0"
          >
            <Minus size={12} className="text-morph-blue" />
            <span className="text-xs text-morph-white truncate max-w-[120px]">
              {window.title || window.windowTag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
