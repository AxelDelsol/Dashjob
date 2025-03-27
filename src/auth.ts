import { SignInSchema } from "@/lib/schemas";
import { comparePasswords, getValidUserByEmail } from "@/lib/users";
import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    user_id: number;
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
    user_id: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (!validatedFields.success) {
          throw new Error("Invalid form");
        }

        const { email, password } = validatedFields.data;

        const user = await getValidUserByEmail(email);

        if (!user) {
          throw new Error("Unknown user");
        }

        if (!comparePasswords(password, user.hashed_password)) {
          throw new Error("Invalid password");
        }

        return { email: user.email, user_id: user.id };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.user_id = user.user_id;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          user_id: token.user_id,
        },
      };
    },
  },
});
