"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { signOut } from "next-auth/react";

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full px-3 py-1.5 text-sm transition-colors",
        active
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:bg-slate-900 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function NavBarClient({ userEmail }: { userEmail: string | null }) {
  const currentPath = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/lion.png" alt="Lion Logo" className="h-10 w-10" />
            <span className="hidden text-sm font-semibold tracking-tight text-white sm:inline">
              Issue Tracker
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink href="/" label="Home" active={currentPath === "/"} />
            <NavLink
              href="/issues"
              label="Issues"
              active={currentPath === "/issues"}
            />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {userEmail ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1.5 transition-colors hover:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  aria-label="Account menu"
                >
                  <span
                    className="h-2 w-2 rounded-full bg-emerald-400"
                    aria-hidden="true"
                  />
                  <span className="max-w-[220px] truncate text-sm text-slate-200">
                    {userEmail}
                  </span>
                  <DropdownMenu.TriggerIcon />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end" sideOffset={8}>
                <DropdownMenu.Item
                  color="red"
                  onSelect={async () => {
                    await signOut({ callbackUrl: "/" });
                  }}
                >
                  Log out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : (
            <Button asChild variant="surface">
              <Link href="/login">LOG IN</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
