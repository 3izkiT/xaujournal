"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthModalOverlay } from "@/components/auth/AuthModalOverlay";
import type { AuthModalMode } from "@/components/auth/AuthModalContent";

export function LoginPageClient({ errorCode }: { errorCode?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthModalMode>("login");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => router.push("/");

  return (
    <div className="min-h-screen bg-xau-app">
      <AuthModalOverlay
        mode={mode}
        errorCode={errorCode}
        onClose={handleClose}
        onSwitchMode={setMode}
      />
    </div>
  );
}
