import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { cache } from "react";

import prisma from "@/app/client";

export const authOptions: NextAuthOptions = {
    secret: process.env.AUTH_SECRET,

    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const email = credentials?.email;
                const password = credentials?.password;
                if (!email || !password) return null;

                const user = await prisma.user.findUnique({
                    where: { email },
                    select: { id: true, email: true, password: true },
                });

                if (!user) return null;

                const isBcryptHash = /^\$2[aby]\$/.test(user.password);
                const passwordOk = isBcryptHash
                    ? await bcrypt.compare(password, user.password)
                    : user.password === password;

                if (!passwordOk) return null;

                return {
                    id: String(user.id),
                    name: user.email,
                    email: user.email,
                };
            },
        }),
    ],
};

export async function auth() {
    return cachedAuth();
}

const cachedAuth = cache(() => getServerSession(authOptions));
