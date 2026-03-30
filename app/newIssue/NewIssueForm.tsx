"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Box, Flex, Text, TextField, Button, Select } from "@radix-ui/themes";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

type UserOption = { id: number; email: string };

type IssueFormValues = {
  title: string;
  userId: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
};

export default function NewIssueForm({ users }: { users: UserOption[] }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
  } = useForm<IssueFormValues>({
    defaultValues: { userId: "unassigned", status: "OPEN" },
  });

  const router = useRouter();
  const [description, setDescription] = useState<string | undefined>("");

  const onsubmit = async (data: IssueFormValues) => {
    const body: Record<string, unknown> = {
      title: data.title,
      description: description ?? "",
      status: data.status,
    };
    if (data.userId !== "unassigned") body.userId = data.userId;

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) return;

    reset();
    setDescription("");
    router.push("/");
  };

  return (
    <Flex justify="center" mt="6" px="4">
      <Box className="w-full max-w-xl">
        <form onSubmit={handleSubmit(onsubmit)}>
          <Flex
            direction="column"
            gap="4"
            className="rounded-xl bg-slate-900 p-6 shadow-lg"
          >
            <Box>
              <Text size="2" color="gray">
                Title
              </Text>
              <TextField.Root placeholder="Enter title..." {...register("title")} />
            </Box>

            <Box>
              <Text size="2" color="gray">
                Related user
              </Text>
              <Controller
                name="userId"
                control={control}
                render={({ field }) => (
                  <div className="mt-1 pl-1">
                    <Select.Root size="3" value={field.value} onValueChange={field.onChange}>
                      <Select.Trigger
                        className="w-full"
                        variant="soft"
                        radius="large"
                        placeholder="Unassigned"
                      />
                      <Select.Content variant="solid">
                        <Select.Item value="unassigned">Unassigned</Select.Item>
                        {users.map((user) => (
                          <Select.Item key={user.id} value={String(user.id)}>
                            {user.email}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </div>
                )}
              />
            </Box>

            <Box>
              <Text size="2" color="gray">
                Status
              </Text>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="mt-1 pl-1">
                    <Select.Root
                      size="3"
                      value={field.value}
                      onValueChange={(value) => field.onChange(value as IssueFormValues["status"])}
                    >
                      <Select.Trigger className="w-full" variant="soft" radius="large" />
                      <Select.Content variant="solid">
                        <Select.Item value="OPEN">Open</Select.Item>
                        <Select.Item value="IN_PROGRESS">In progress</Select.Item>
                        <Select.Item value="CLOSED">Closed</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </div>
                )}
              />
            </Box>

            <Box>
              <Text size="2" color="gray" mb="2">
                Description
              </Text>
              <MDEditor value={description} onChange={setDescription} height={200} />
            </Box>

            <Button disabled={isSubmitting} loading={isSubmitting}>
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
