"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getChat } from "@/app/dashboard/actions";
import { getEvents, sendMessage } from "./actions";
import EventList from "@/components/chat/EventList";
import ChatInput from "@/components/chat/ChatInput";
import { InferSelectModel } from "drizzle-orm";
import { chats, modules, events } from "@/db/schema";

type ChatWithModule = InferSelectModel<typeof chats> & {
  module: InferSelectModel<typeof modules> | null;
};

type Event = InferSelectModel<typeof events>;

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;

  const [chat, setChat] = useState<ChatWithModule | null>(null);
  const [eventList, setEventList] = useState<Event[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (chatId) {
      getChat(chatId).then((data) => setChat(data || null));
      getEvents(chatId).then(setEventList);
    }
  }, [chatId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (chatId) {
        getEvents(chatId).then(setEventList);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [chatId]);

  const handleSend = async (message: string) => {
    setSending(true);
    try {
      await sendMessage(chatId, message);

      const newEvents = await getEvents(chatId);
      setEventList(newEvents);
    } finally {
      setSending(false);
    }
  };

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
          <div className="flex-1 overflow-y-auto p-4">
            <EventList events={eventList} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={sending} />
        </div>

        {/* Right side - Windows (65%) */}
        <div className="w-[65%] bg-morph-dark flex items-center justify-center">
          <p className="text-morph-white/30 text-sm">
            Simulations will appear here
          </p>
        </div>
      </div>
    </main>
  );
}
