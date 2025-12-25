"use server";

import { db } from "@/db/index";
import { and, eq, like, inArray } from "drizzle-orm";
import { chats, modules, participants } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { ChatSettingsValues } from "@/lib/config/settings";

export async function getChats(
  search: string = "",
  page: number = 1,
  limit: number = 10
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const offset = (page - 1) * limit;

  const records = await db.query.chats.findMany({
    where: and(eq(chats.userId, user.id), like(chats.title, `%${search}%`)),
    with: { module: true },
    orderBy: (chats, { desc }) => [desc(chats.createdAt)],
    limit,
    offset,
  });

  return records;
}

export async function getModules(search: string = "", limit: number = 10) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const userModuleIds = db
    .select({ moduleId: participants.moduleId })
    .from(participants)
    .where(eq(participants.userId, user.id));

  const records = await db.query.modules.findMany({
    where: and(
      inArray(modules.id, userModuleIds),
      like(modules.name, `%${search}%`)
    ),
    orderBy: (modules, { desc }) => [desc(modules.createdAt)],
    limit,
  });

  return records;
}

export async function getChat(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const record = await db.query.chats.findFirst({
    where: and(eq(chats.id, id), eq(chats.userId, user.id)),
    with: { module: true },
  });

  return record;
}

export async function createChat(
  title: string,
  moduleId: string | null,
  settings: ChatSettingsValues
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const [record] = await db
    .insert(chats)
    .values({
      userId: user.id,
      moduleId,
      settings,
      title,
    })
    .returning();

  return record;
}
