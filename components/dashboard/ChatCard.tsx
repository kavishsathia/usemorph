"use client";

import Link from "next/link";
import { Settings, MessageSquare } from "lucide-react";
import { ChatSettingsValues } from "@/lib/config/settings";

interface ChatCardProps {
  id: string;
  title: string | null;
  summary: string | null;
  settings: ChatSettingsValues | null;
  moduleName: string | null;
  createdAt: Date;
  onEditSettings?: (id: string) => void;
}

export default function ChatCard({
  id,
  title,
  summary,
  settings,
  moduleName,
  createdAt,
  onEditSettings,
}: ChatCardProps) {
  const displayTitle = title || "Untitled chat";
  const displayDate = createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Get active settings to show as badges
  const activeBadges: { key: string; value: string }[] = [];
  if (settings?.pace) activeBadges.push({ key: "pace", value: settings.pace });
  if (settings?.challenge)
    activeBadges.push({ key: "challenge", value: settings.challenge });
  if (settings?.timeAvailable)
    activeBadges.push({ key: "time", value: settings.timeAvailable });

  return (
    <div className="group bg-morph-panel border border-morph-border p-6 hover:border-morph-blue/50 transition-colors duration-300">
      {/* Header row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {moduleName && (
            <span className="text-xs font-mono text-morph-blue/60">
              {moduleName}
            </span>
          )}
          {!moduleName && (
            <span className="text-xs font-mono text-morph-white/30">
              No module
            </span>
          )}
        </div>
        <span className="text-xs text-morph-white/40">{displayDate}</span>
      </div>

      {/* Title */}
      <Link href={`/chat/${id}`} className="block group/link">
        <h3 className="font-display text-lg text-morph-white mb-2 group-hover/link:text-morph-blue transition-colors">
          {displayTitle}
        </h3>
      </Link>

      {/* Summary */}
      {summary && (
        <p className="text-sm text-morph-white/50 mb-4 line-clamp-2">
          {summary}
        </p>
      )}
      {!summary && (
        <p className="text-sm text-morph-white/30 mb-4 italic">
          No summary yet
        </p>
      )}

      {/* Footer: badges + actions */}
      <div className="flex justify-between items-center">
        {/* Settings badges */}
        <div className="flex gap-2 flex-wrap">
          {activeBadges.map((badge) => (
            <span
              key={badge.key}
              className="px-2 py-1 text-xs font-mono bg-morph-border/50 text-morph-white/60"
            >
              {badge.value}
            </span>
          ))}
          {activeBadges.length === 0 && (
            <span className="text-xs text-morph-white/30">No settings</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onEditSettings && (
            <button
              onClick={() => onEditSettings(id)}
              className="p-2 text-morph-white/40 hover:text-morph-blue transition-colors"
              title="Edit settings"
            >
              <Settings size={16} />
            </button>
          )}
          <Link
            href={`/chat/${id}`}
            className="p-2 text-morph-white/40 hover:text-morph-blue transition-colors"
            title="Open chat"
          >
            <MessageSquare size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}