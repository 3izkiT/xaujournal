import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { routing, type AppLocale } from "./routing";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  let locale: AppLocale = routing.defaultLocale;

  if (cookieLocale && routing.locales.includes(cookieLocale as AppLocale)) {
    locale = cookieLocale as AppLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
