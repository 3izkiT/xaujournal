"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { isDatabaseConfigured } from "@/lib/db";

function isFailedSignInUrl(url: string) {
  const lower = url.toLowerCase();
  return lower.includes("/login") || lower.includes("error=");
}

export async function loginAction(formData: FormData) {
  if (!isDatabaseConfigured) {
    redirect("/login?error=db");
  }

  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    redirect("/login?error=empty");
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: "/dashboard",
    });

    const url = typeof result === "string" ? result : "";
    if (!url || isFailedSignInUrl(url)) {
      redirect("/login?error=invalid");
    }
  } catch {
    redirect("/login?error=server");
  }

  redirect("/dashboard");
}
