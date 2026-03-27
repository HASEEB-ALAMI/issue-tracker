import { Card, Flex, Skeleton } from "@radix-ui/themes";

export default function Loading() {
  return (
    <Flex justify="center" mt="6" px="4">
      <Card size="3" style={{ maxWidth: 600, width: "100%" }}>
        <Flex direction="column" gap="4">
          <Skeleton height="28px" />
          <Skeleton height="18px" width="120px" />
          <Skeleton height="1px" />
          <Skeleton height="88px" />
          <Skeleton height="1px" />
          <Skeleton height="18px" width="260px" />
          <Skeleton height="18px" width="260px" />
        </Flex>
      </Card>
    </Flex>
  );
}
