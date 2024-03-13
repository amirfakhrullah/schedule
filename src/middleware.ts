import { NextRequest, NextResponse } from "next/server";

const authPaths = ["/", "/auth", "/courses", "/notes", "search"];

export async function middleware(req: NextRequest) {
  // early escape for routes that don't need auth checking
  if (!authPaths.includes(req.nextUrl.pathname)) return NextResponse.next(req);

  const BASE_URL = req.nextUrl.origin;

  const checkAuth = await fetch(`${BASE_URL}/api/auth-check`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  // if authed, redirect "/auth" route to "/"
  if (checkAuth.status === 200 && req.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(BASE_URL);
  }
  // if not authed, redirect all routes to "/auth"
  if (checkAuth.status === 401 && req.nextUrl.pathname !== "/auth") {
    return NextResponse.redirect(`${BASE_URL}/auth`);
  }
  return NextResponse.next(req);
}

export const config = {
  // all routes except "/api", "_next/static", "/favicon.ico"
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
