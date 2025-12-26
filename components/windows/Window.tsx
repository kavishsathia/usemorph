import { memo } from "react";
import { InferSelectModel } from "drizzle-orm";
import { Minus, X } from "lucide-react";
import { windows } from "@/db/schema";

type WindowType = InferSelectModel<typeof windows>;

interface WindowProps {
  window: WindowType;
  onMinimise: (windowId: string) => void;
  onClose: (windowId: string) => void;
}

function Window({
  window,
  onMinimise,
  onClose,
}: WindowProps) {
  return (
    <div className="w-full h-full flex flex-col bg-morph-panel border border-morph-border shadow-xl">
      {/* Title bar - this is the drag handle */}
      <div className="drag-handle flex items-center justify-between px-3 py-2 bg-morph-dark border-b border-morph-border cursor-move shrink-0">
        <span className="text-xs text-morph-white truncate">
          {window.title || window.windowTag}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMinimise(window.id)}
            className="p-1 hover:bg-morph-border rounded transition-colors"
          >
            <Minus size={12} className="text-morph-white/60" />
          </button>
          <button
            onClick={() => onClose(window.id)}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
          >
            <X size={12} className="text-morph-white/60 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Content - iframe with srcdoc */}
      <div className="flex-1 overflow-hidden">
        <iframe
          key={`${window.id}-${window.srcdoc?.length || 0}`}
          srcDoc={window.srcdoc}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title={window.title || window.windowTag}
        />
      </div>
    </div>
  );
}

// Only re-render when content-related props change, not position/size
export default memo(Window, (prevProps, nextProps) => {
  return (
    prevProps.window.id === nextProps.window.id &&
    prevProps.window.srcdoc === nextProps.window.srcdoc &&
    prevProps.window.title === nextProps.window.title &&
    prevProps.window.windowTag === nextProps.window.windowTag &&
    prevProps.window.isMinimised === nextProps.window.isMinimised &&
    prevProps.window.isClosed === nextProps.window.isClosed
  );
});
