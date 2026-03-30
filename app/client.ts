import "server-only";

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import fs from "node:fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function mariaDbUrlFromEnv() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const rewritten = databaseUrl.replace(/^mysql:\/\//, "mariadb://");
  if (!rewritten.startsWith("mariadb://")) {
    throw new Error("DATABASE_URL must start with mysql:// or mariadb://");
  }

  let url: URL;
  try {
    url = new URL(rewritten);
  } catch {
    // Fall back to raw string if URL parsing fails (e.g., unusual characters in password).
    return rewritten;
  }

  const isLocalHost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const socketPathFromUrl = url.searchParams.get("socketPath");
  if (isLocalHost && !socketPathFromUrl) {
    const candidates = ["/var/run/mysqld/mysqld.sock", "/run/mysqld/mysqld.sock"];
    const existing = candidates.find((candidate) => fs.existsSync(candidate));
    if (existing) url.searchParams.set("socketPath", existing);
  }

  // Keep host normalization (mariadb adapter prefers IP over localhost in some envs)
  if (url.hostname === "localhost") url.hostname = "127.0.0.1";

  url.searchParams.set("connectTimeout", "5000");
  url.searchParams.set("acquireTimeout", "5000");

  return url.toString();
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaMariaDb(mariaDbUrlFromEnv(), {
      onConnectionError: (err) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("[prisma] MariaDB connection error:", err);
        }
      },
    }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
