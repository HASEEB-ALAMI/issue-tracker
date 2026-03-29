import "server-only";

import { cache } from "react";
import prisma from "@/app/client";
import type { Status } from "@/app/generated/prisma";

export type IssueListItem = {
  id: number;
  title: string;
  status: Status;
  user: { email: string } | null;
};

export type IssuesByUserPoint = { email: string; issues: number };

export const getRecentIssues = cache(async (take = 50): Promise<IssueListItem[]> => {
  return prisma.issue.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
});

export const getIssueById = cache(async (id: number) => {
  return prisma.issue.findUnique({ where: { id } });
});

export const getIssuesByUserEmailChart = cache(async (): Promise<IssuesByUserPoint[]> => {
  const grouped = await prisma.issue.groupBy({
    by: ["userId"],
    _count: { _all: true },
  });

  const userIds = grouped
    .map((row) => row.userId)
    .filter((id): id is number => typeof id === "number");

  const users = userIds.length
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, email: true },
      })
    : [];

  const emailById = new Map(users.map((u) => [u.id, u.email]));

  return grouped
    .map((row) => {
      if (row.userId == null) return { email: "Unassigned", issues: row._count._all };
      return {
        email: emailById.get(row.userId) ?? `User #${row.userId}`,
        issues: row._count._all,
      };
    })
    .sort((a, b) => b.issues - a.issues || a.email.localeCompare(b.email));
});

