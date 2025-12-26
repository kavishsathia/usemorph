"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowDown } from "lucide-react";
import { getChat } from "@/app/dashboard/actions";
import { getEvents, getWindows, sendMessage, updateWindow } from "./actions";
import EventList from "@/components/chat/EventList";
import ChatInput from "@/components/chat/ChatInput";
import { InferSelectModel } from "drizzle-orm";
import { chats, modules, events, windows } from "@/db/schema";
import { createClient } from "@/lib/supabase/client";
import WindowsView from "@/components/windows/WindowsView";

type ChatWithModule = InferSelectModel<typeof chats> & {
  module: InferSelectModel<typeof modules> | null;
};

type Event = InferSelectModel<typeof events>;
type Window = InferSelectModel<typeof windows>;

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;

  const [chat, setChat] = useState<ChatWithModule | null>(null);
  const [eventList, setEventList] = useState<Event[]>([]);
  const [windowList, setWindowList] = useState<Window[]>([]);
  const [sending, setSending] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;
    setShowScrollButton(!isNearBottom);
  }, []);

  useEffect(() => {
    if (chatId) {
      getChat(chatId).then((data) => setChat(data || null));
      getEvents(chatId).then(setEventList);
      getWindows(chatId).then(setWindowList);
    }
  }, [chatId]);

  const handlePositionUpdate = useCallback(
    (
      windowId: string,
      updates: { posX?: number; posY?: number; width?: number; height?: number }
    ) => {
      updateWindow(windowId, updates);
    },
    []
  );

  const handleContentUpdate = useCallback(
    (windowId: string, updates: Partial<InferSelectModel<typeof windows>>) => {
      setWindowList((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, ...updates } : w))
      );
      updateWindow(windowId, updates);
    },
    []
  );

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("events-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "events",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newEvent = {
            id: payload.new.id,
            chatId: payload.new.chat_id,
            eventType: payload.new.event_type,
            content: payload.new.content,
            metadata: payload.new.metadata,
            createdAt: new Date(payload.new.created_at),
          };
          setEventList((prev) => [...prev, newEvent]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const handleSend = async (message: string) => {
    setSending(true);
    try {
      await sendMessage(chatId, message);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("windows-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "windows",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newWindow = {
            id: payload.new.id,
            chatId: payload.new.chat_id,
            posX: payload.new.pos_x,
            posY: payload.new.pos_y,
            width: payload.new.width,
            height: payload.new.height,
            createdAt: new Date(payload.new.created_at),
            srcdoc: payload.new.srcdoc,
            title: payload.new.title,
            isMinimised: payload.new.is_minimised,
            isClosed: payload.new.is_closed,
            windowTag: payload.new.window_tag,
            eventId: payload.new.event_id,
          };
          setWindowList((prev) => [...prev, newWindow]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "windows",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setWindowList((prev) => {
            const existing = prev.find((w) => w.id === payload.new.id);
            if (!existing) return prev;
            const contentSame =
              existing.srcdoc === payload.new.srcdoc &&
              existing.title === payload.new.title &&
              existing.windowTag === payload.new.window_tag;
            if (contentSame) return prev;
            return prev.map((w) =>
              w.id === payload.new.id
                ? {
                    ...w,
                    srcdoc: payload.new.srcdoc,
                    title: payload.new.title,
                    windowTag: payload.new.window_tag,
                    eventId: payload.new.event_id,
                  }
                : w
            );
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "windows",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setWindowList((prev) => prev.filter((w) => w.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const displayTitle = chat?.title || "Untitled chat";

  return (
    <main className="h-screen bg-morph-black flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-morph-border shrink-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="font-display text-xl font-bold text-morph-white tracking-tighter"
          >
            MORPH
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-morph-white/60 hover:text-morph-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side - Chat (35%) */}
        <div className="w-[35%] border-r border-morph-border flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b border-morph-border shrink-0">
            <h1 className="font-display text-lg text-morph-white">
              {displayTitle}
            </h1>
            {chat?.module && (
              <span className="text-xs font-mono text-morph-blue/60">
                {chat.module.name}
              </span>
            )}
          </div>

          {/* Event list */}
          <div className="relative flex-1">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="absolute inset-0 overflow-y-auto p-4 scrollbar-hide"
            >
              <EventList events={eventList} />
            </div>

            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-4 right-4 p-2 bg-morph-blue text-white rounded-full shadow-lg hover:bg-morph-blueDim transition-colors"
              >
                <ArrowDown size={18} />
              </button>
            )}
          </div>

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={sending} />
        </div>

        {/* Right side - Windows (65%) */}
        <div className="w-[65%] bg-morph-dark flex items-center justify-center">
          <WindowsView
            windows={windowList}
            onPositionUpdate={handlePositionUpdate}
            onContentUpdate={handleContentUpdate}
          />
        </div>
      </div>
    </main>
  );
}
