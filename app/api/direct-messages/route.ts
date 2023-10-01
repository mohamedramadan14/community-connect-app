import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const MESSAGES_PATCH = 10;

    const profile = await currentProfile();
    if (!profile) return new NextResponse("unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!conversationId)
      return new NextResponse("Conversation ID is missing", { status: 400 });

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_PATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_PATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_PATCH) {
      nextCursor = messages[messages.length - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[DIRECT-MESSAGES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
