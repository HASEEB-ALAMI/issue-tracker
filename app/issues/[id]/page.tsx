import {
  Card,
  Text,
  Heading,
  Flex,
  Box,
  Separator,
} from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import prisma from "@/app/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) notFound();

  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  const issue = await prisma.issue.findUnique({
    where: { id },
  });

  if (!issue) notFound();

  return (
    <Flex justify="center" mt="6" px="4">
      <Card size="3" style={{ maxWidth: 600, width: "100%" }}>
        <Flex direction="column" gap="4">

          {/* Title + ID */}
          <Box>
            <Heading size="6">{issue.title}</Heading>
            <Text size="2" color="gray">
              ID: {issue.id}
            </Text>
          </Box>

          <Separator size="4" />

          {/* Description */}
          <Box>
            <Text size="3"><ReactMarkdown>{issue.description}</ReactMarkdown>
</Text>
          </Box>

          <Separator size="4" />

          {/* Dates */}
          <Flex direction="column" gap="2">
            <Text size="2" color="gray">
              Created At: {issue.createdAt.toLocaleString()}
            </Text>
            <Text size="2" color="gray">
              Updated At: {issue.updatedAt.toLocaleString()}
            </Text>
          </Flex>

        </Flex>
      </Card>
    </Flex>
  );
}



