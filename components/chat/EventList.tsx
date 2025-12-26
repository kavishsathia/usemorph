"use client";

import UserMessage from "./UserMessage";
import ModelMessage from "./ModelMessage";
import ToolCall from "./ToolCall";

interface Event {
  id: string;
  eventType: "user_input" | "model_response" | "tool_call" | "tool_result";
  content: string | null;
  metadata: unknown;
  createdAt: Date;
}

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => {
        switch (event.eventType) {
          case "user_input":
            return (
              <UserMessage
                key={event.id}
                content={event.content || ""}
                timestamp={event.createdAt}
              />
            );
          case "model_response":
            return (
              <ModelMessage
                key={event.id}
                content={event.content || ""}
                timestamp={event.createdAt}
              />
            );
          case "tool_call": {
            const metadata = event.metadata as { args?: Record<string, unknown> } | null;
            return (
              <ToolCall
                key={event.id}
                toolName={event.content || "unknown"}
                args={metadata?.args || {}}
                timestamp={event.createdAt}
              />
            );
          }
          case "tool_result":
            // Skip tool_result - we only show tool_call
            return null;
          default:
            return null;
        }
      })}
    </div>
  );
}
