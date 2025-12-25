import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getChat } from "@/app/dashboard/actions";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const chat = await getChat(id);

  if (!chat) {
    notFound();
  }

  const displayTitle = chat.title || "Untitled chat";

  return (
    <main className="min-h-screen bg-morph-black">
      {/* Header */}
      <header className="border-b border-morph-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-morph-white/40 hover:text-morph-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl text-morph-white">
              {displayTitle}
            </h1>
            {chat.module && (
              <span className="text-xs font-mono text-morph-blue/60">
                {chat.module.name}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Chat area - placeholder */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="border border-morph-border border-dashed py-24 flex flex-col items-center justify-center">
          <p className="text-morph-white/50">Chat interface coming soon...</p>
        </div>
      </div>
    </main>
  );
}
