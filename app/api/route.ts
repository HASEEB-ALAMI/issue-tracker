import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/app/client";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createIssueSchema = z.object({
  title: z.string().max(20),
  description: z.string().min(10),
  userId: z.coerce.number().int().positive().optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createIssueSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const newIssue = await prisma.issue.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.userId ? { userId: parsed.data.userId } : {}),
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Database error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const takeParam = searchParams.get("take");

    let take: number | undefined = undefined;

    if (takeParam) {
      const parsedTake = parseInt(takeParam);
      if (!isNaN(parsedTake) && parsedTake > 0) {
        take = parsedTake;
      }
    }

    const issues = await prisma.issue.findMany({
      orderBy: { createdAt: "desc" },
      ...(take ? { take } : {}),
    });

    return NextResponse.json(issues, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Database error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
