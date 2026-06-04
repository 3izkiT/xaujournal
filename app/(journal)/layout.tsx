import type { Metadata } from "next";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { XauJournalProvider } from "@/components/XauJournalContext";
import { XauJournalShell } from "@/components/XauJournalShell";
import { getAppSession } from "@/lib/app-session";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function JournalLayout({ children }: { children: ReactNode }) {
  const session = await getAppSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return (
    <XauJournalProvider>
      <XauJournalShell>{children}</XauJournalShell>
    </XauJournalProvider>
  );
}
