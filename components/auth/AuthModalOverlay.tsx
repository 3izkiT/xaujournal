"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AuthModalContent, type AuthModalMode } from "@/components/auth/AuthModalContent";

type Props = {
  mode: AuthModalMode;
  errorCode?: string;
  onClose: () => void;
  onSwitchMode: (mode: AuthModalMode) => void;
};

export function AuthModalOverlay({ mode, errorCode, onClose, onSwitchMode }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    panelRef.current?.focus();
  }, [mode]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" role="presentation">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/45 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-3xl border border-xau-border bg-xau-card p-6 shadow-2xl max-h-[min(90vh,720px)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xau-muted transition hover:bg-xau-app hover:text-xau-ink"
        >
          <CloseIcon />
        </button>
        <AuthModalContent mode={mode} errorCode={errorCode} onSwitchMode={onSwitchMode} />
      </div>
    </div>,
    document.body
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
