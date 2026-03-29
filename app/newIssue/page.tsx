import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewIssueForm from "./NewIssueForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Issue",
};

export default async function NewIssuePage() {
  const session = await auth();
  if (!session) redirect("/login");

  return <NewIssueForm />;
}
