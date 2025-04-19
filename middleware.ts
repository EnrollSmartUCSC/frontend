// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Protect everything under /dashboard
export const config = { matcher: ["/dashboard/:path*"] };
