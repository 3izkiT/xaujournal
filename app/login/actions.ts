"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { isDatabaseConfigured } from "@/lib/db";

export type LoginState = {
  error?: string;
};

export async function authenticate(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  if (!isDatabaseConfigured) {
    return { error: "Server database is not configured. Please try again later." };
  }

  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password." };
      }
      return { error: "Sign in failed. Please try again." };
    }
    throw error;
  }

  return {};
}
