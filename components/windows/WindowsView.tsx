"use client";

import { useState } from "react";
import { InferSelectModel } from "drizzle-orm";
import { windows } from "@/db/schema";
import Minimised from "./Minimised";
import Window from "./Window";
import { Rnd } from "react-rnd";

type Window = InferSelectModel<typeof windows>;

interface WindowsViewProps {
  windows: Window[];
  onPositionUpdate: (windowId: string, updates: { posX?: number; posY?: number; width?: number; height?: number }) => void;
  onContentUpdate: (windowId: string, updates: Partial<Window>) => void;
}

export default function WindowsView({
  windows,
  onPositionUpdate,
  onContentUpdate,
}: WindowsViewProps) {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const minimisedWindows = windows.filter((w) => w.isMinimised && !w.isClosed);
  const activeWindows = windows.filter((w) => !w.isMinimised && !w.isClosed);

  const handleUnminimise = (windowId: string) => {
    onContentUpdate(windowId, { isMinimised: false });
    setFocusedId(windowId);
  };

  return (
    <div className="relative w-full h-full bg-morph-dark">
      <Minimised
        minimisedWindows={minimisedWindows}
        onUnminimise={handleUnminimise}
      />

      {activeWindows.length === 0 && minimisedWindows.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-morph-white/30 text-sm">
            Simulations will appear here
          </p>
        </div>
      )}

      {activeWindows.map((window) => (
        <Rnd
          key={window.id}
          default={{
            x: window.posX,
            y: window.posY,
            width: window.width,
            height: window.height,
          }}
          style={{ zIndex: focusedId === window.id ? 10 : 1 }}
          bounds="parent"
          dragHandleClassName="drag-handle"
          minWidth={300}
          minHeight={200}
          onMouseDown={() => setFocusedId(window.id)}
          onDragStop={(e, d) => {
            onPositionUpdate(window.id, { posX: Math.round(d.x), posY: Math.round(d.y) });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            onPositionUpdate(window.id, {
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              posX: Math.round(position.x),
              posY: Math.round(position.y),
            });
          }}
        >
          <Window
            window={window}
            onMinimise={(windowId) =>
              onContentUpdate(windowId, { isMinimised: true })
            }
            onClose={(windowId) => onContentUpdate(windowId, { isClosed: true })}
          />
        </Rnd>
      ))}
    </div>
  );
}
