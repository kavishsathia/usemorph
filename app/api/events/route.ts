import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chats, events } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { and, eq } from "drizzle-orm";

const EVENT_TYPES = [
  "user_input",
  "model_response",
  "tool_call",
  "tool_result",
] as const;

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get("x-api-key") !== process.env.COMMS_API_KEY) {
      return NextResponse.json({ error: `Incorrect API key` }, { status: 401 });
    }
    const body = await request.json();
    const { chatId, eventType, content, metadata } = body;

    if (!chatId || typeof chatId !== "string") {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 }
      );
    }

    if (!eventType || !EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { error: `eventType must be one of: ${EVENT_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const [event] = await db
      .insert(events)
      .values({
        chatId,
        eventType,
        content,
        metadata,
      })
      .returning();

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
