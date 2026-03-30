import { Table } from "@radix-ui/themes";

function SkeletonCell() {
  return <div className="h-4 w-full rounded bg-slate-700/60" />;
}

export default function Loading() {
  const rows = [1, 2, 3, 4, 5];
  return (
    <main className="p-6 animate-pulse">
      <Table.Root variant="ghost">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>User Email</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.map((key) => (
            <Table.Row key={key}>
              <Table.RowHeaderCell>
                <SkeletonCell />
              </Table.RowHeaderCell>
              <Table.Cell>
                <SkeletonCell />
              </Table.Cell>
              <Table.Cell>
                <SkeletonCell />
              </Table.Cell>
              <Table.Cell>
                <SkeletonCell />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </main>
  );
}
