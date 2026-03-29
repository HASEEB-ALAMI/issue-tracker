"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Box, Flex, Text, TextField, Button } from "@radix-ui/themes";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

type IssueFormValues = {
  title: string;
  description: string;
};

export default function NewIssueForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IssueFormValues>();

  const router = useRouter();
  const [description, setDescription] = useState<string | undefined>("");

  const onsubmit = async (data: IssueFormValues) => {
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        description,
      }),
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

