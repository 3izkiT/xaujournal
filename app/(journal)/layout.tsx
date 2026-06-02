import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/app-session";
import { XauJournalProvider } from "@/components/XauJournalContext";
import { XauJournalShell } from "@/components/XauJournalShell";

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
