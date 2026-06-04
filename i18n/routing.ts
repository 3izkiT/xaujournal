import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "th"],
  defaultLocale: "en",
  localePrefix: "never",
});

export type AppLocale = (typeof routing.locales)[number];
