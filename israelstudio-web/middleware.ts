import { NextResponse } from "next/server";
import { ENABLE_AUTH } from "@/lib/authFlag";
import { withAuth } from "next-auth/middleware";

// Auth disabled middleware - blocks all auth-related routes
function authDisabledMiddleware(req: Request) {
  const url = new URL(req.url);
  
  // Block all /api/auth/* calls
  if (url.pathname.startsWith("/api/auth/")) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication is disabled" }), 
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }
  
  // Redirect /signin to home
  if (url.pathname === "/signin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  
  // Show 403 for admin routes
  if (url.pathname.startsWith("/admin")) {
    return new NextResponse("Admin functionality is disabled", { status: 403 });
  }
  
  return NextResponse.next();
}

// Auth enabled middleware - use NextAuth
const authEnabledMiddleware = withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !!token && (token.role === "OWNER" || token.role === "ASSISTANT");
    },
  },
});

export default function middleware(req: Request) {
  if (!ENABLE_AUTH) {
    return authDisabledMiddleware(req);
  }
  
  return authEnabledMiddleware(req);
}

export const config = {
  matcher: ["/signin", "/admin/:path*", "/api/auth/:path*"],
};
