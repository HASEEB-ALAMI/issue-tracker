import { NextResponse } from "next/server";
import prisma from "@/app/client";
import z from "zod";
import { auth } from "@/auth";
import type { Prisma } from "@prisma/client";

const updateIssueSchema = z
  .object({
    title: z.string().max(20).optional(),
    description: z.string().min(10).optional(),
    userId: z.coerce.number().int().positive().optional(),
    status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.description !== undefined ||
      value.userId !== undefined ||
      value.status !== undefined,
    { message: "At least one field is required" },
  );

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Adjust based on your Prisma schema type
    const issue = await prisma.issue.findUnique({
      where: {
        id: parseInt(id), // use id directly if it's a string in Prisma
      },
    });

    if (!issue) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(issue, { status: 200 });
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Adjust based on your Prisma schema type
    const issue = await prisma.issue.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!issue) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: `issue ${id} deleted seccusfully` }, { status: 200 });
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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateIssueSchema.safeParse(body);
  const { id } = await params;


  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const data: Prisma.IssueUncheckedUpdateInput = {};
    if (parsed.data.title !== undefined) data.title = parsed.data.title;
    if (parsed.data.description !== undefined) data.description = parsed.data.description;
    if (parsed.data.userId !== undefined) data.userId = parsed.data.userId;
    if (parsed.data.status !== undefined) data.status = parsed.data.status;

    const newIssue = await prisma.issue.update({
      where: {
        id: parseInt(id)
      },
      data,
    });

    return NextResponse.json(newIssue, { status: 200 });
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
