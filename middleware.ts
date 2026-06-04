import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Locale is resolved from the NEXT_LOCALE cookie in i18n/request.ts.
// Avoid next-intl URL rewrites — pages live at root paths without a [locale] segment.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
