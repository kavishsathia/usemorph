"use server";

import { db } from "@/db/index";
import { eq, InferSelectModel } from "drizzle-orm";
import { events, chats, windows } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { runAgentTask } from "@/src/trigger/agent";

type Window = InferSelectModel<typeof windows>;

export async function getEvents(chatId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const records = await db.query.events.findMany({
    where: eq(events.chatId, chatId),
    orderBy: (events, { asc }) => [asc(events.createdAt)],
  });

  return records;
}

export async function getWindows(chatId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const records = await db.query.windows.findMany({
    where: eq(windows.chatId, chatId),
  });

  return records;
}

export async function updateWindow(
  windowId: string,
  updates: Partial<Window>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const [updatedWindow] = await db
    .update(windows)
    .set(updates)
    .where(eq(windows.id, windowId))
    .returning();

  return updatedWindow;
}

export async function sendMessage(chatId: string, message: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const chat = await db.query.chats.findFirst({
    where: eq(chats.id, chatId),
    with: { module: true },
  });

  if (!chat) throw new Error("Chat not found");

  const [userEvent] = await db
    .insert(events)
    .values({
      chatId,
      eventType: "user_input",
      content: message,
      metadata: {},
    })
    .returning();

  const history = await db.query.events.findMany({
    where: eq(events.chatId, chatId),
    orderBy: (events, { asc }) => [asc(events.createdAt)],
  });

  await runAgentTask.trigger({
    message,
    history: history.map((e) => ({
      event_type: e.eventType,
      content: e.content || "",
      metadata: (e.metadata as Record<string, unknown>) || {},
    })),
    settings: (chat.settings as Record<string, unknown>) || {},
    chatId,
    module: chat.module?.name,
  });

  return userEvent;
}
