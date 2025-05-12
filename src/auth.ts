import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import findValidUserByEmail from "./lib/users/get-users";
import { comparePasswords } from "./lib/users/sign-in/compare-passwords";

declare module "next-auth" {
  interface User {
    userId: number;
  }

  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    userId: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
        },
        password: {
          type: "password",
          label: "Password",
        },
      },
      async authorize(credentials) {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new Error("Invalid form");
        }

        const user = await findValidUserByEmail(email);

        if (!user) {
          throw new Error("Unknown user");
        }

        if (!comparePasswords(password, user.hashedPassword)) {
          throw new Error("Invalid password");
        }

        return { email: user.email, userId: user.id };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.userId = user.userId;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          userId: token.userId,
        },
      };
    },
  },
});
