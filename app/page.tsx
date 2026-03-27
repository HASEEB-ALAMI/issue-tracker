import { Table } from "@radix-ui/themes";
import prisma from "@/app/client";
import type { Status } from "../generated/prisma";
import Link from "next/link";
import IssueRow from "./issueRow";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Page() {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 600));
  }


  let issues: Array<{ id: number; title: string; status: Status }> = [];
  let dbError: string | null = null;

  try {
    issues = await prisma.issue.findMany({
      select: { id: true, title: true, status: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Unknown database error";
    console.error("[issues] failed to load:", err);
  }

  return (
    <main className="p-6">
      {dbError ? (
        <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Database connection failed. Check that your database is running and
          that <code>DATABASE_URL</code> is correct. ({dbError})
        </p>
      ) : null}
      {!dbError && issues.length === 0 ? (
        <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          No issues yet.{" "}
          <Link href="/form" className="underline">
            Create your first issue
          </Link>
          .
        </div>
      ) : null}
      <Table.Root variant="ghost">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {!dbError && issues.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={3}>No issues found.</Table.Cell>
            </Table.Row>
          ) : null}
          {issues.map((data) => (
            <IssueRow
              key={data.id}
              id={data.id}
              title={data.title}
              status={data.status}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </main>
  );
}
