"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthModal } from "@/components/auth/AuthModalProvider";

/** Opens auth modal from `/?auth=login` or `/?auth=register` (e.g. OAuth error redirects). */
export function HomeAuthQueryModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openLogin, openRegister } = useAuthModal();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    const auth = searchParams.get("auth");
    const error = searchParams.get("error") ?? undefined;
    if (!auth) return;

    handled.current = true;
    if (auth === "login") openLogin(error);
    else if (auth === "register") openRegister();

    const url = new URL(window.location.href);
    url.searchParams.delete("auth");
    url.searchParams.delete("error");
    url.searchParams.delete("verified");
    router.replace(url.pathname + (url.search || ""), { scroll: false });
  }, [searchParams, openLogin, openRegister, router]);

  return null;
}
