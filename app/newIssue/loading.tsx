export default function Loading() {
  return (
    <div className="flex justify-center mt-20 px-4">
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-xl shadow-lg space-y-5 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-slate-700/60" />
          <div className="h-10 w-full rounded bg-slate-800/60" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-slate-700/60" />
          <div className="h-24 w-full rounded bg-slate-800/60" />
        </div>
        <div className="h-10 w-full rounded bg-slate-800/60" />
      </div>
    </div>
  );
}

