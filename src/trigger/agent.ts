import { logger, task } from "@trigger.dev/sdk/v3";
import { python } from "@trigger.dev/python";

interface Message {
  event_type: string;
  content: string;
  metadata: Record<string, unknown>;
}

interface AgentPayload {
  message: string;
  history: Message[];
  settings: Record<string, unknown>;
  chatId: string;
  module?: string;
}

export const runAgentTask = task({
  id: "run-agent",
  maxDuration: 300,
  run: async (payload: AgentPayload) => {
    logger.log("Running agent", { chatId: payload.chatId });

    const result = await python.runScript("./python/main.py", [
      JSON.stringify(payload),
    ]);

    logger.log("Agent completed", { result });

    return result;
  },
});
