"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Label from "@radix-ui/react-label";

type IssueFormValues = {
  title: string;
  description: string;
};

export default function FormPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IssueFormValues>();
  const router = useRouter();

  const onsubmit = async (data: IssueFormValues) => {
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) return;

    reset();
    router.push("/");
  };
  return (
    <div className="flex justify-center mt-20 px-4">
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full max-w-md bg-slate-900 p-6 rounded-xl shadow-lg space-y-5"
      >
        {/* Title */}
        <div className="flex flex-col space-y-1">
          <Label.Root htmlFor="title" className="text-sm text-slate-300">
            Title
          </Label.Root>

          <input
            id="title"
            {...register("title")}
            placeholder="Enter title..."
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1">
          <Label.Root htmlFor="description" className="text-sm text-slate-300">
            Description
          </Label.Root>

          <textarea
            id="description"
            {...register("description")}
            placeholder="Enter description..."
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none min-h-[100px] resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium transition"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[1em] w-[1em] shrink-0 animate-spin"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.001 5.04a2.32 2.32 0 1 0 0-4.64 2.32 2.32 0 0 0 0 4.64zm0 18.56a2.32 2.32 0 1 0 0-4.64 2.32 2.32 0 0 0 0 4.64zm9.197-14.23a2.32 2.32 0 1 1-2.32-4.02 2.32 2.32 0 0 1 2.32 4.02zM1.956 17.8a2.32 2.32 0 1 0 4.018-2.32 2.32 2.32 0 0 0-4.018 2.32zm16.922.85a2.32 2.32 0 1 1 2.32-4.02 2.32 2.32 0 0 1-2.32 4.02zM1.956 6.2a2.32 2.32 0 1 0 4.018 2.32A2.32 2.32 0 0 0 1.956 6.2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Submit</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
