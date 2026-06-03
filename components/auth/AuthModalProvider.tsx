"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { AuthModalOverlay } from "@/components/auth/AuthModalOverlay";
import type { AuthModalMode } from "@/components/auth/AuthModalContent";

type AuthModalContextValue = {
  openLogin: (errorCode?: string) => void;
  openRegister: () => void;
  close: () => void;
  isOpen: boolean;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthModalMode | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>();

  const close = useCallback(() => {
    setMode(null);
    setErrorCode(undefined);
  }, []);

  const openLogin = useCallback((code?: string) => {
    setErrorCode(code);
    setMode("login");
  }, []);

  const openRegister = useCallback(() => {
    setErrorCode(undefined);
    setMode("register");
  }, []);

  const value = useMemo(
    () => ({
      openLogin,
      openRegister,
      close,
      isOpen: mode !== null,
    }),
    [openLogin, openRegister, close, mode]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {mode && (
        <AuthModalOverlay
          mode={mode}
          errorCode={errorCode}
          onClose={close}
          onSwitchMode={(next) => {
            setErrorCode(undefined);
            setMode(next);
          }}
        />
      )}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}
