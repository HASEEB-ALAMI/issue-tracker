import type { Metadata } from "next";
import { auth } from "@/auth";
import UserIssuesChart from "./userIssuesChart";
import { getIssuesByUserEmailChart } from "./lib/issueData";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  const session = await auth();

  let chartData: Awaited<ReturnType<typeof getIssuesByUserEmailChart>> = [];
  let dbError: string | null = null;

  try {
    chartData = await getIssuesByUserEmailChart();
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Unknown database error";
    console.error("[dashboard] failed to load chart data:", err);
  }

  return (
    <main className="p-6">
      {session ? (
        <div className="mb-6 rounded border border-slate-800 bg-slate-950 p-4 text-slate-100">
          Welcome <span className="font-semibold">{session.user?.email}</span>
        </div>
      ) : (
        <div className="mb-6 rounded border border-slate-800 bg-slate-950 p-4 text-slate-200">
          Viewing as guest.{" "}
          <a href="/login" className="underline">
            Log in
          </a>{" "}
          to manage issues.
        </div>
      )}

      {dbError ? (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Database connection failed. Check that your database is running and that{" "}
          <code>DATABASE_URL</code> is correct. ({dbError})
        </p>
      ) : (
        <UserIssuesChart data={chartData} />
      )}
    </main>
  );
}
