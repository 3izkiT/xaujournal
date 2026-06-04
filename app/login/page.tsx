import type { Metadata } from "next";
import { LoginForm } from "@/app/login/LoginForm";
import { LoginPageClient } from "@/app/login/LoginPageClient";
import { EMAIL_AUTH_ENABLED } from "@/lib/auth-mode";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign in",
  description: "Sign in to your XAURite XAUUSD trading journal — discipline logs, analytics, and chart gallery.",
  path: "/login",
});

type Props = {
  searchParams: Promise<{ error?: string; verified?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;

  if (EMAIL_AUTH_ENABLED) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-xau-app px-4">
        <LoginForm errorCode={params.error} verified={params.verified === "1"} />
      </div>
    );
  }

  return <LoginPageClient errorCode={params.error} />;
}
