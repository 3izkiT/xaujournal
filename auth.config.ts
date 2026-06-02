import type { NextAuthConfig } from "next-auth";

function shouldUseSecureCookies() {
  if (process.env.AUTH_USE_SECURE_COOKIES === "true") return true;
  if (process.env.AUTH_USE_SECURE_COOKIES === "false") return false;
  // NODE_ENV=production on local `next start` is still http — only secure cookies on real HTTPS deploy.
  return process.env.VERCEL === "1" || process.env.AUTH_URL?.startsWith("https://") === true;
}

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  useSecureCookies: shouldUseSecureCookies(),
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
