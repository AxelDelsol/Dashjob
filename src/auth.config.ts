import type { NextAuthConfig } from "next-auth";

const PROTECTED_ROUTES = ["/applications"];

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isProtected = PROTECTED_ROUTES.some((element) =>
        nextUrl.pathname.startsWith(element),
      );
      const isLoggedIn = !!auth?.user;

      return !isProtected || isLoggedIn;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
