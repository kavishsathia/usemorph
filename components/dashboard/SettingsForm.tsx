"use client";

import { useState, useEffect } from "react";
import { InferSelectModel } from "drizzle-orm";
import { modules } from "@/db/schema";
import SettingField from "./SettingField";
import { ChatSettingsValues, chatSettingsKeys } from "@/lib/config/settings";
import { getModules } from "@/app/dashboard/actions";

type Module = InferSelectModel<typeof modules>;

interface SettingsFormProps {
  initialTitle?: string;
  initialModuleId?: string | null;
  initialSettings?: ChatSettingsValues;
  onSubmit: (
    title: string,
    moduleId: string | null,
    settings: ChatSettingsValues
  ) => void;
  loading?: boolean;
}

export default function SettingsForm({
  initialTitle = "",
  initialModuleId = null,
  initialSettings = {},
  onSubmit,
  loading = false,
}: SettingsFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [moduleId, setModuleId] = useState<string | null>(initialModuleId);
  const [settings, setSettings] = useState<ChatSettingsValues>(initialSettings);
  const [moduleList, setModuleList] = useState<Module[]>([]);

  useEffect(() => {
    getModules("", 50).then(setModuleList);
  }, []);

  const handleSettingChange = (
    key: keyof ChatSettingsValues,
    value: string
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, moduleId, settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title field */}
      <div className="space-y-2">
        <label className="block text-sm text-morph-white font-medium">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Learning Newton's Laws"
          className="w-full bg-morph-dark border border-morph-border px-3 py-2 text-sm text-morph-white placeholder:text-morph-white/30 focus:outline-none focus:border-morph-blue transition-colors"
          required
        />
      </div>

      {/* Module selector */}
      <div className="space-y-2">
        <label className="block text-sm text-morph-white font-medium">
          Module
        </label>
        <p className="text-xs text-morph-white/50">
          Optional - ground your chat in a specific module
        </p>
        <select
          value={moduleId || ""}
          onChange={(e) => setModuleId(e.target.value || null)}
          className="w-full bg-morph-dark border border-morph-border px-3 py-2 text-sm text-morph-white focus:outline-none focus:border-morph-blue transition-colors"
        >
          <option value="">No module</option>
          {moduleList.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.name}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="border-t border-morph-border" />

      {/* Settings fields */}
      {chatSettingsKeys.map((key) => (
        <SettingField
          key={key}
          settingKey={key}
          value={settings[key]}
          onChange={(value) => handleSettingChange(key, value)}
        />
      ))}

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-full bg-morph-white text-morph-black py-3 font-display font-bold tracking-tight hover:bg-morph-blue hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Chat"}
      </button>
    </form>
  );
}
