import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/app/client";

export const runtime = "nodejs";

const createIssueSchema = z.object({
  title: z.string().max(20),
  description: z.string().min(10),
});

export async function POST(request: Request) {
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
