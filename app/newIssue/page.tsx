import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewIssueForm from "./NewIssueForm";
import prisma from "@/app/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Issue",
};

export default async function NewIssuePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const users = await prisma.user.findMany({
    select: { id: true, email: true },
    orderBy: { email: "asc" },
  });

  return <NewIssueForm users={users} />;
}
