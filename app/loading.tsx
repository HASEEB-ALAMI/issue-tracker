import { Skeleton } from "@radix-ui/themes";

export default function Loading() {
  const rows = Array.from({ length: 6 });

  return (
    <main className="p-6">
      <div className="mb-6 rounded border border-slate-800 bg-slate-950 p-4 text-slate-100">
        <Skeleton height="16px" width="320px" />
      </div>

      <section className="rounded border border-slate-800 bg-slate-950 p-4 text-slate-100">
        <Skeleton height="14px" width="140px" />

        <div className="mt-4 h-[320px] w-full">
          <Skeleton height="320px" />
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-3 py-2"
            >
              <Skeleton height="14px" width="70%" />
              <Skeleton height="14px" width="18%" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
