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
import IssueActions from "./IssueActions";

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
    <Flex className="min-h-screen w-full px-3 sm:px-6 lg:px-10 py-6">
      <Card
        size="3"
        className="
        w-full 
        min-h-[90vh] 
        flex 
        flex-col 
        justify-between 
        p-4 sm:p-6 lg:p-10
      "
      >
        <Flex direction="column" className="gap-6 lg:gap-10">

          {/* Title + ID */}
          <Box>
            <Heading
              className="
              text-2xl 
              sm:text-3xl 
              lg:text-5xl 
              font-bold 
              leading-tight
            "
            >
              {issue.title}
            </Heading>

            <Text className="text-xs sm:text-sm lg:text-base text-gray-500 mt-2">
              ID: {issue.id}
            </Text>
          </Box>

          <Separator size="4" />

          {/* Description */}
          <Box
            className="
            prose 
            max-w-none 
            text-sm 
            sm:text-base 
            lg:text-xl
            lg:leading-relaxed
          "
          >
            <ReactMarkdown>{issue.description}</ReactMarkdown>
          </Box>

          <Separator size="4" />

          {/* Dates */}
          <Flex
            className="
            flex-col 
            gap-1 
            text-xs 
            sm:text-sm 
            lg:text-base 
            text-gray-500
          "
          >
            <Text>
              Created At: {issue.createdAt.toLocaleString()}
            </Text>
            <Text>
              Updated At: {issue.updatedAt.toLocaleString()}
            </Text>
          </Flex>
        </Flex>

        <IssueActions
          id={issue.id}
          initialTitle={issue.title}
          initialDescription={issue.description}
        />
      </Card>
    </Flex>
  );
}


