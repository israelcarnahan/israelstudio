import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !!token && (token.role === "OWNER" || token.role === "ASSISTANT");
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
