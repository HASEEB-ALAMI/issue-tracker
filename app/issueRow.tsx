"use client";

import { Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  title: string;
  status: string;
  userEmail?: string | null;
};

export default function IssueRow({ id, title, status, userEmail }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/issue/${id}`);
  };

  return (
    <Table.Row
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
      role="link"
      className="cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
    >
      <Table.RowHeaderCell>{id}</Table.RowHeaderCell>
      <Table.Cell>{title}</Table.Cell>
      <Table.Cell>{status}</Table.Cell>
      <Table.Cell>{userEmail ?? "—"}</Table.Cell>
    </Table.Row>
  );
}
