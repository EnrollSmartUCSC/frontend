import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // this forces Google to ask for credentials every time
          prompt: "login",
          // optionally: access_type & response_type if you need offline access:
          // access_type: "offline",
          // response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: { /* … */ },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
