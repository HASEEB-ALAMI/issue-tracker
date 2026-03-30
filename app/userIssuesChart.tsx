"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = { email: string; issues: number };

export default function UserIssuesChart({ data }: { data: ChartPoint[] }) {
  if (!data.length) {
    return (
      <section className="rounded border border-slate-800 bg-slate-950 p-4 text-slate-200">
        No issues to chart yet.
      </section>
    );
  }

  return (
    <section className="rounded border border-slate-800 bg-slate-950 p-4 text-slate-100">
      <h2 className="text-sm font-semibold text-slate-200">Issues by user</h2>

      <div className="mt-4 h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
          <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
            <XAxis
              dataKey="email"
              interval={0}
              angle={-25}
              textAnchor="end"
              height={60}
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: "rgba(148,163,184,0.10)" }}
              contentStyle={{
                background: "rgba(2,6,23,0.95)",
                border: "1px solid rgba(148,163,184,0.35)",
                borderRadius: 10,
                color: "#e2e8f0",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              formatter={(value) => [`${value}`, "Issues"]}
            />
            <Bar dataKey="issues" fill="#60a5fa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((row) => (
          <div
            key={row.email}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-3 py-2"
          >
            <span className="max-w-[70%] truncate text-sm text-slate-200">
              {row.email}
            </span>
            <span className="text-sm font-semibold text-slate-100">
              {row.issues}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
