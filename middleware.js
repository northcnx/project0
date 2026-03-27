import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * ตรวจและ decode JWT
 */
const getJwtPayload = async (token) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  // whitelist role
  if (!payload.role || !["admin", "user"].includes(payload.role)) {
    throw new Error("Invalid role");
  }

  return payload;
};

/**
 * @param {import("next/server").NextRequest} req
 */
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  let payload = null;

  if (token) {
    try {
      payload = await getJwtPayload(token);
    } catch (err) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      return res;
    }
  }

  // ---------------------------
  // (2) หน้า /login
  // ---------------------------
  if (pathname === "/login") {
    if (!payload) return NextResponse.next();

    return payload.role === "admin"
      ? NextResponse.redirect(new URL("/back1/dashboard", req.url))
      : NextResponse.redirect(new URL("/back2/dashboard", req.url));
  }

  // ---------------------------
  // (3) หน้า protected
  // ---------------------------
  if (pathname.startsWith("/back1")) {
    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/back2/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/back2")) {
    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (payload.role !== "user") {
      return NextResponse.redirect(new URL("/back1/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/back1/:path*", "/back2/:path*"],
};
