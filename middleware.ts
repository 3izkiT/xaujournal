import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth is enforced in app/(journal)/layout.tsx (Node.js) so session cookies work reliably.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
