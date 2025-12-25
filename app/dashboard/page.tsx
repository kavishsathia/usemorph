"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, MessageSquare } from "lucide-react";
import { createChat, getChats } from "./actions";
import { InferSelectModel } from "drizzle-orm";
import { chats, modules } from "@/db/schema";
import ChatCard from "@/components/dashboard/ChatCard";
import { ChatSettingsValues } from "@/lib/config/settings";
import Modal from "@/components/ui/Modal";
import SettingsForm from "@/components/dashboard/SettingsForm";

type ChatWithModule = InferSelectModel<typeof chats> & {
  module: InferSelectModel<typeof modules> | null;
};

export default function DashboardPage() {
  const [chatList, setChatList] = useState<ChatWithModule[]>([]);
  const [createChatOpen, setCreateChatOpen] = useState(false);

  useEffect(() => {
    getChats("", 1, 10).then((data) => setChatList(data));
  }, []);

  return (
    <main className="min-h-screen bg-morph-black">
      {/* Navigation */}
      <nav className="border-b border-morph-border">
        <div className="px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-display text-xl font-bold text-morph-white tracking-tighter">
            MORPH
          </Link>
          <button
            onClick={() => setCreateChatOpen(true)}
            className="flex items-center gap-2 bg-morph-blue text-white px-4 py-2 text-sm font-medium hover:bg-morph-blueDim transition-colors"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-morph-blue" />
            <span className="text-xs font-mono text-morph-white/50 uppercase tracking-wider">
              Dashboard
            </span>
          </div>
          <h1 className="font-display text-4xl text-morph-white tracking-tighter mb-2">
            Your Conversations
          </h1>
          <p className="text-morph-white/50 max-w-xl">
            Pick up where you left off or start something new.
          </p>
        </div>

        {/* Chat grid */}
        {chatList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {chatList.map((chat) => (
              <ChatCard
                key={chat.id}
                id={chat.id}
                moduleName={chat.module?.name || null}
                title={chat.title}
                summary={chat.summary}
                settings={chat.settings as ChatSettingsValues}
                createdAt={chat.createdAt}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {chatList.length === 0 && (
          <div className="border border-morph-border border-dashed py-24 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border border-morph-border flex items-center justify-center mb-6">
              <MessageSquare size={24} className="text-morph-white/30" />
            </div>
            <h3 className="font-display text-xl text-morph-white mb-2">
              No conversations yet
            </h3>
            <p className="text-morph-white/50 mb-6 text-center max-w-sm">
              Start a new chat to begin your learning journey with Morph.
            </p>
            <button
              onClick={() => setCreateChatOpen(true)}
              className="flex items-center gap-2 bg-morph-white text-morph-black px-6 py-3 font-display font-bold tracking-tight hover:bg-morph-blue hover:text-white transition-colors duration-300"
            >
              <Plus size={18} />
              Create your first chat
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={createChatOpen}
        onClose={() => setCreateChatOpen(false)}
        title="Create Chat"
      >
        <SettingsForm
          onSubmit={(title, moduleId, settings) => {
            createChat(title, moduleId, settings).then(() => {
              setCreateChatOpen(false);
              getChats("", 1, 10).then(setChatList);
            });
          }}
        />
      </Modal>
    </main>
  );
}
