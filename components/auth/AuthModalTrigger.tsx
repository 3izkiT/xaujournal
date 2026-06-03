"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { useAuthModal } from "@/components/auth/AuthModalProvider";
import type { AuthModalMode } from "@/components/auth/AuthModalContent";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  mode: AuthModalMode;
  children: ReactNode;
};

/** Opens the auth modal instead of navigating to /login or /register. */
export function AuthModalTrigger({ mode, children, onClick, ...rest }: Props) {
  const { openLogin, openRegister } = useAuthModal();

  return (
    <button
      type="button"
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (mode === "login") openLogin();
        else openRegister();
      }}
    >
      {children}
    </button>
  );
}
