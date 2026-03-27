"use client";

import { Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  title: string;
  status: string;
};

export default function IssueRow({ id, title, status }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/issues/${id}`); // or whatever route you want
  };

  return (
    <Table.Row onClick={handleClick} style={{ cursor: "pointer" }}>
      <Table.RowHeaderCell>{id}</Table.RowHeaderCell>
      <Table.Cell>{title}</Table.Cell>
      <Table.Cell>{status}</Table.Cell>
    </Table.Row>
  );
}