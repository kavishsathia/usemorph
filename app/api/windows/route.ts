import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { windows } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const ACTIONS = ["create", "close", "minimize", "replace_src"] as const;
type Action = (typeof ACTIONS)[number];

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get("x-api-key") !== process.env.COMMS_API_KEY) {
      return NextResponse.json({ error: "Incorrect API key" }, { status: 401 });
    }

    const body = await request.json();
    const { action, chatId, windowTag } = body;

    if (!action || !ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: `action must be one of: ${ACTIONS.join(", ")}` },
        { status: 400 }
      );
    }

    if (!chatId || typeof chatId !== "string") {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 }
      );
    }

    if (!windowTag || typeof windowTag !== "string") {
      return NextResponse.json(
        { error: "windowTag is required" },
        { status: 400 }
      );
    }

    switch (action as Action) {
      case "create": {
        const { srcdoc, title, eventId } = body;

        if (!srcdoc || typeof srcdoc !== "string") {
          return NextResponse.json(
            { error: "srcdoc is required for create" },
            { status: 400 }
          );
        }

        const [window] = await db
          .insert(windows)
          .values({
            chatId,
            windowTag,
            srcdoc,
            title,
            eventId,
          })
          .returning();

        return NextResponse.json(window, { status: 201 });
      }

      case "close": {
        const [window] = await db
          .update(windows)
          .set({ isClosed: true })
          .where(and(eq(windows.chatId, chatId), eq(windows.windowTag, windowTag)))
          .returning();

        if (!window) {
          return NextResponse.json({ error: "Window not found" }, { status: 404 });
        }

        return NextResponse.json(window);
      }

      case "minimize": {
        const { isMinimised } = body;

        const [window] = await db
          .update(windows)
          .set({ isMinimised: isMinimised ?? true })
          .where(and(eq(windows.chatId, chatId), eq(windows.windowTag, windowTag)))
          .returning();

        if (!window) {
          return NextResponse.json({ error: "Window not found" }, { status: 404 });
        }

        return NextResponse.json(window);
      }

      case "replace_src": {
        const { oldSrc, newSrc } = body;

        if (!oldSrc || !newSrc) {
          return NextResponse.json(
            { error: "oldSrc and newSrc are required for replace_src" },
            { status: 400 }
          );
        }

        const existingWindow = await db.query.windows.findFirst({
          where: and(eq(windows.chatId, chatId), eq(windows.windowTag, windowTag)),
        });

        if (!existingWindow) {
          return NextResponse.json({ error: "Window not found" }, { status: 404 });
        }

        const updatedSrcdoc = existingWindow.srcdoc.replace(oldSrc, newSrc);

        const [window] = await db
          .update(windows)
          .set({ srcdoc: updatedSrcdoc })
          .where(and(eq(windows.chatId, chatId), eq(windows.windowTag, windowTag)))
          .returning();

        return NextResponse.json(window);
      }
    }
  } catch (error) {
    console.error("Failed to handle window action:", error);
    return NextResponse.json(
      { error: "Failed to handle window action" },
      { status: 500 }
    );
  }
}
