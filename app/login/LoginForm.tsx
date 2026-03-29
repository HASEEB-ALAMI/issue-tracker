"use client";

import { useState, ChangeEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Card, Text, Heading, Flex, Button } from "@radix-ui/themes";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <Flex align="center" justify="center" className="min-h-screen px-4">
      <Card
        size="3"
        className="
          w-full 
          max-w-md 
          sm:max-w-lg 
          lg:max-w-xl 
          p-6 sm:p-8 lg:p-10
          shadow-lg
        "
      >
        <Flex direction="column" gap="5">
          <Heading className="text-2xl sm:text-3xl font-bold text-center">
            Login
          </Heading>

          <Flex direction="column" gap="1">
            <Text size="2">Email</Text>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="
                w-full
                px-3 py-2
                rounded-md
                border border-gray-300
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                text-sm sm:text-base
              "
            />
          </Flex>

          <Flex direction="column" gap="1">
            <Text size="2">Password</Text>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              className="
                w-full
                px-3 py-2
                rounded-md
                border border-gray-300
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                text-sm sm:text-base
              "
            />
          </Flex>

          <Button
            size="3"
            className="
              w-full 
              mt-2
              !h-12 
              sm:!h-14 
              text-base 
              sm:text-lg
            "
            onClick={handleLogin}
          >
            Login
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}

