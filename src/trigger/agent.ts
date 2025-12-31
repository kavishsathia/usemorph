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

    // Pass payload via stdin to avoid E2BIG error with large conversation histories
    const result = await python.runScript("./python/main.py", [], {
      input: JSON.stringify(payload),
    });

    logger.log("Agent completed", { result });

    return result;
  },
});
