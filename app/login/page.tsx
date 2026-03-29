import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return <LoginForm />;
}

