"use client";

import { AlertDialog, Box, Button, Flex, Select, Text, TextField } from "@radix-ui/themes";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = {
  id: number;
  initialTitle: string;
  initialDescription: string;
  initialStatus: "OPEN" | "IN_PROGRESS" | "CLOSED";
};

export default function IssueActions({
  id,
  initialTitle,
  initialDescription,
  initialStatus,
}: Props) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState<string | undefined>(
    initialDescription,
  );
  const [status, setStatus] = useState<Props["initialStatus"]>(initialStatus);
  const [error, setError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (isEditing) return;
    setTitle(initialTitle);
    setDescription(initialDescription);
    setStatus(initialStatus);
  }, [initialTitle, initialDescription, initialStatus, isEditing]);

  const canSubmit = useMemo(() => {
    const trimmedTitle = title.trim();
    const trimmedDescription = (description ?? "").trim();
    return trimmedTitle.length > 0 && trimmedDescription.length > 0;
  }, [title, description]);

  async function onSave() {
    setError(null);
    setIsSaving(true);
    try {
      const response = await fetch(`/api/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.error ??
          payload?.message ??
          `Failed to update issue (${response.status})`;
        setError(message);
        return;
      }

      setIsEditing(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update issue");
    } finally {
      setIsSaving(false);
    }
  }

  async function onStatusChange(nextStatus: Props["initialStatus"]) {
    setError(null);
    setStatus(nextStatus);
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.error ??
          payload?.message ??
          `Failed to update status (${response.status})`;
        setError(message);
        setStatus(initialStatus);
        return;
      }

      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status");
      setStatus(initialStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function onDelete() {
    setError(null);
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.error ??
          payload?.message ??
          `Failed to delete issue (${response.status})`;
        setError(message);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete issue");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Box className="mt-6 w-full">
      {error ? (
        <Box className="mb-3 rounded border border-red-200 bg-red-50 p-3">
          <Text className="text-sm text-red-700">{error}</Text>
        </Box>
      ) : null}

      {!isEditing ? (
        <Box className="mb-4">
          <Text className="text-xs sm:text-sm text-gray-500 mb-1">Status</Text>
          <div className="mt-1 pl-1">
            <Select.Root
              size="3"
              value={status}
              onValueChange={(value) => onStatusChange(value as Props["initialStatus"])}
              disabled={isUpdatingStatus || isDeleting}
            >
              <Select.Trigger className="w-full" variant="soft" radius="large" />
              <Select.Content variant="solid">
                <Select.Item value="OPEN">Open</Select.Item>
                <Select.Item value="IN_PROGRESS">In progress</Select.Item>
                <Select.Item value="CLOSED">Closed</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </Box>
      ) : null}

      {isEditing ? (
        <Flex direction="column" className="gap-4">
          <Box>
            <Text className="text-xs sm:text-sm text-gray-500">Title</Text>
            <TextField.Root
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
            />
          </Box>

          <Box>
            <Text className="text-xs sm:text-sm text-gray-500 mb-1">Status</Text>
            <div className="mt-1 pl-1">
              <Select.Root
                size="3"
                value={status}
                onValueChange={(value) => setStatus(value as Props["initialStatus"])}
                disabled={isSaving}
              >
                <Select.Trigger className="w-full" variant="soft" radius="large" />
                <Select.Content variant="solid">
                  <Select.Item value="OPEN">Open</Select.Item>
                  <Select.Item value="IN_PROGRESS">In progress</Select.Item>
                  <Select.Item value="CLOSED">Closed</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </Box>

          <Box>
            <Text className="text-xs sm:text-sm text-gray-500 mb-2">
              Description
            </Text>
            <MDEditor value={description} onChange={setDescription} height={200} />
          </Box>

          <Flex className="flex-col md:flex-row gap-3 w-full">
            <Button
              size="3"
              className="w-full md:w-1/2 md:!h-14 lg:!h-16 md:!text-lg lg:!text-xl"
              disabled={!canSubmit || isSaving}
              loading={isSaving}
              onClick={onSave}
            >
              Save
            </Button>
            <Button
              size="3"
              variant="soft"
              color="gray"
              className="w-full md:w-1/2 md:!h-14 lg:!h-16 md:!text-lg lg:!text-xl"
              onClick={() => {
                setTitle(initialTitle);
                setDescription(initialDescription);
                setStatus(initialStatus);
                setError(null);
                setIsEditing(false);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Flex className="flex-col md:flex-row gap-3 w-full">
          <Button
            size="3"
            className="w-full md:w-1/2 md:!h-14 lg:!h-16 md:!text-lg lg:!text-xl"
            onClick={() => {
              setError(null);
              setIsEditing(true);
            }}
          >
            Edit
          </Button>

          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button
                size="3"
                color="red"
                className="w-full md:w-1/2 md:!h-14 lg:!h-16 md:!text-lg lg:!text-xl"
              >
                Delete
              </Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content className="max-w-lg lg:max-w-xl">
              <AlertDialog.Title className="text-lg lg:text-2xl">
                Delete issue
              </AlertDialog.Title>

              <AlertDialog.Description className="text-sm lg:text-base">
                Are you sure? This issue will be deleted permanently.
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray" disabled={isDeleting}>
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    variant="solid"
                    color="red"
                    onClick={onDelete}
                    disabled={isDeleting}
                    loading={isDeleting}
                  >
                    Delete
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Flex>
      )}
    </Box>
  );
}
