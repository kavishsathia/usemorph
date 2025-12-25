"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import {
  chatSettings,
  isSelectSetting,
  ChatSettingsKey,
} from "@/lib/config/settings";

interface SettingFieldProps {
  settingKey: ChatSettingsKey;
  value: string | undefined;
  onChange: (value: string) => void;
}

export default function SettingField({
  settingKey,
  value,
  onChange,
}: SettingFieldProps) {
  const setting = chatSettings[settingKey];

  if (isSelectSetting(setting)) {
    return (
      <div className="flex items-center justify-between gap-4">
        {/* Label + Description */}
        <div className="shrink-0">
          <label className="block text-sm text-morph-white font-medium">
            {setting.label}
          </label>
          <p className="text-xs text-morph-white/50">{setting.description}</p>
        </div>

        {/* Options */}
        <div className="flex gap-2">
          {setting.options.map((option) => (
            <Tooltip.Provider key={option.value} delayDuration={200}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={`px-3 py-2 text-sm border transition-colors ${
                      value === option.value
                        ? "border-morph-blue bg-morph-blue/20 text-morph-white"
                        : "border-morph-border text-morph-white/60 hover:border-morph-white/40"
                    }`}
                  >
                    {option.label}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-morph-dark border border-morph-border px-3 py-2 text-sm text-morph-white/80 max-w-xs"
                    sideOffset={5}
                  >
                    {option.tooltip}
                    <Tooltip.Arrow className="fill-morph-border" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ))}
        </div>
      </div>
    );
  }

  // Text input - keep vertical layout
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm text-morph-white font-medium">
          {setting.label}
        </label>
        <p className="text-xs text-morph-white/50">{setting.description}</p>
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={""}
        className="w-full bg-morph-dark border border-morph-border px-3 py-2 text-sm text-morph-white placeholder:text-morph-white/30 focus:outline-none focus:border-morph-blue transition-colors"
      />
    </div>
  );
}
