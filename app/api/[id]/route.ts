import { NextResponse } from "next/server";
import prisma from "@/app/client";
import z from "zod";

const createIssueSchema = z.object({
  title: z.string().max(20),
  description: z.string().min(10),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  const body = await request.json().catch(() => null);
  const parsed = createIssueSchema.safeParse(body);
  const { id } = await params;


  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const newIssue = await prisma.issue.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
      },
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