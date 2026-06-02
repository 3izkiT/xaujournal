import type { NextAuthConfig } from "next-auth";

const isProduction = process.env.NODE_ENV === "production";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  // Local dev runs on http://localhost — must not use __Secure- cookies or login never sticks.
  useSecureCookies: isProduction,
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ["/dashboard", "/journal-entry", "/calendar", "/gallery", "/settings"];
      const isProtected = protectedPaths.some((p) => nextUrl.pathname.startsWith(p));

      if (isProtected) {
        return isLoggedIn;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      if (user?.email) token.email = user.email;
      if (user?.name) token.name = user.name;
      if ("plan" in user && user.plan) token.plan = user.plan as string;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "";
        session.user.plan = (token.plan as "FREE" | "PREMIUM_GOLD") ?? "FREE";
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
