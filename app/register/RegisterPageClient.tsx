"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthModalOverlay } from "@/components/auth/AuthModalOverlay";
import { RegisterForm } from "@/app/register/RegisterForm";
import { EMAIL_AUTH_ENABLED } from "@/lib/auth-mode";
import type { AuthModalMode } from "@/components/auth/AuthModalContent";

export function RegisterPageClient() {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (EMAIL_AUTH_ENABLED) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-xau-app px-4 py-12">
        <RegisterForm />
      </div>
    );
  }

  const handleClose = () => router.push("/");

  return (
    <div className="min-h-screen bg-xau-app">
      <AuthModalOverlay mode={"register" satisfies AuthModalMode} onClose={handleClose} onSwitchMode={() => router.push("/login")} />
    </div>
  );
}
