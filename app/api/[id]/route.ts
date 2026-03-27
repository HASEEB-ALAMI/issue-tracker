import { NextResponse } from "next/server";
import prisma from "@/app/client";

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
