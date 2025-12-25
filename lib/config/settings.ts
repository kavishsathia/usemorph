export const chatSettings = {
  pace: {
    key: "pace",
    label: "Learning Pace",
    description: "How quickly Morph progresses through concepts",
    options: [
      {
        value: "slow",
        label: "Slow",
        tooltip:
          "More examples, frequent check-ins, extra time on each concept",
      },
      {
        value: "moderate",
        label: "Moderate",
        tooltip: "Balanced progression with room for questions",
      },
      {
        value: "fast",
        label: "Fast",
        tooltip: "Move quickly, assume comfort with prerequisites",
      },
    ],
  },
  challenge: {
    key: "challenge",
    label: "Challenge Level",
    description: "How much Morph pushes back on your answers",
    options: [
      {
        value: "gentle",
        label: "Gentle",
        tooltip: "Encouraging, provides hints readily, softer questioning",
      },
      {
        value: "balanced",
        label: "Balanced",
        tooltip: "Mix of support and challenge",
      },
      {
        value: "rigorous",
        label: "Rigorous",
        tooltip:
          "Expects deeper reasoning, fewer hints, more Socratic pressure",
      },
    ],
  },
  hints: {
    key: "hints",
    label: "Hint Frequency",
    description: "How readily Morph offers hints when you're stuck",
    options: [
      {
        value: "rarely",
        label: "Rarely",
        tooltip: "Let me struggle longer before helping",
      },
      {
        value: "sometimes",
        label: "Sometimes",
        tooltip: "Offer hints after a reasonable attempt",
      },
      {
        value: "often",
        label: "Often",
        tooltip: "Provide hints proactively when stuck",
      },
    ],
  },
  priorKnowledge: {
    key: "priorKnowledge",
    label: "Prior Knowledge",
    description: "Your familiarity with this topic",
    type: "text" as const,
    placeholder: "e.g., I've taken intro physics but never covered relativity",
  },
  timeAvailable: {
    key: "timeAvailable",
    label: "Time Available",
    description: "How long you have for this session",
    options: [
      { value: "15min", label: "15 min", tooltip: "Quick focused session" },
      { value: "30min", label: "30 min", tooltip: "Standard session" },
      { value: "1hr", label: "1 hour", tooltip: "Deep dive" },
      { value: "open", label: "Open", tooltip: "No time constraint" },
    ],
  },
  goal: {
    key: "goal",
    label: "Learning Goal",
    description: "What you want to achieve (free text)",
    type: "text" as const,
    placeholder: "e.g., Understand Newton's laws well enough to solve problems",
  },
} as const;

export const isSelectSetting = (
  setting: (typeof chatSettings)[keyof typeof chatSettings]
): setting is (typeof chatSettings)["pace"] => {
  return "options" in setting;
};

export type ChatSettingsValues = {
  pace?: "slow" | "moderate" | "fast";
  challenge?: "gentle" | "balanced" | "rigorous";
  hints?: "rarely" | "sometimes" | "often";
  priorKnowledge?: string;
  timeAvailable?: "15min" | "30min" | "1hr" | "open";
  goal?: string;
};

export type ChatSettingsKey = keyof typeof chatSettings;
export const chatSettingsKeys = Object.keys(chatSettings) as ChatSettingsKey[];
