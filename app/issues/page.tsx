import type { Metadata } from "next";
import { Button, Flex, Table } from "@radix-ui/themes";
import Link from "next/link";
import IssueRow from "../issueRow";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getRecentIssues } from "../lib/issueData";

export const metadata: Metadata = {
    title: "Issues",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Page() {
    const session = await auth();
    if (!session) redirect("/login");

    if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 600));
    }

    let issues: Awaited<ReturnType<typeof getRecentIssues>> = [];
    let dbError: string | null = null;

    try {
        issues = await getRecentIssues(50);
    } catch (err) {
        dbError = err instanceof Error ? err.message : "Unknown database error";
        console.error("[issues] failed to load:", err);
    }

    return (
        <main className="p-6">
            <Flex justify="end" mb="4">
                <Button asChild>
                    <Link href="/newIssue">New Issue</Link>
                </Button>
            </Flex>
            {dbError ? (
                <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    Database connection failed. Check that your database is running and
                    that <code>DATABASE_URL</code> is correct. ({dbError})
                </p>
            ) : null}
            {!dbError && issues.length === 0 ? (
                <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    No issues yet.{" "}
                    <Link href="/newIssue" className="underline">
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
                        <Table.ColumnHeaderCell>User Email</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {!dbError && issues.length === 0 ? (
                        <Table.Row>
                            <Table.Cell colSpan={4}>No issues found.</Table.Cell>
                        </Table.Row>
                    ) : null}
                    {issues.map((data) => (
                        <IssueRow
                            key={data.id}
                            id={data.id}
                            title={data.title}
                            status={data.status}
                            userEmail={data.user?.email}
                        />
                    ))}
                </Table.Body>
            </Table.Root>
        </main>
    );
}
