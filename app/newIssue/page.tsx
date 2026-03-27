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

export default function FormPage() {
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
        description, // ✅ use markdown value
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
            className="bg-slate-900 p-6 rounded-xl shadow-lg"
          >
            {/* Title */}
            <Box>
              <Text size="2" color="gray">
                Title
              </Text>

              <TextField.Root
                placeholder="Enter title..."
                {...register("title")}
              />
            </Box>

            {/* Description (Markdown Editor) */}
            <Box>
              <Text size="2" color="gray" mb="2">
                Description
              </Text>

              <MDEditor
                value={description}
                onChange={setDescription}
                height={200}
              />
            </Box>

            {/* Submit */}
            <Button disabled={isSubmitting} loading={isSubmitting}>
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}