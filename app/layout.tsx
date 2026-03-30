import "./globals.css";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import NavBar from "./navBar";
import { Theme } from "@radix-ui/themes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Issue Tracker",
    template: "%s | Issue Tracker",
  },
  description: "Track and manage issues.",
  icons: {
    icon: [{ url: "/lion.png", type: "image/png" }],
    apple: [{ url: "/lion.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Theme appearance="dark" accentColor="blue" radius="large">
          <NavBar />
          {children}
        </Theme>
      </body>
    </html>
  )
}
