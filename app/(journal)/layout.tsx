import { ReactNode } from "react";
import { XauJournalProvider } from "@/components/XauJournalContext";
import { XauJournalShell } from "@/components/XauJournalShell";

export default function JournalLayout({ children }: { children: ReactNode }) {
  return (
    <XauJournalProvider>
      <XauJournalShell>{children}</XauJournalShell>
    </XauJournalProvider>
  );
}
