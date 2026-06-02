import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard/:path*", "/journal-entry/:path*", "/calendar/:path*", "/gallery/:path*"],
};
