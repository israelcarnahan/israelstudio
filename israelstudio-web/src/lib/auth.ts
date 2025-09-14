import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For development, allow any email/password combination
        // In production, you'd validate against your database
        if (credentials.email && credentials.password) {
          return {
            id: "1",
            email: credentials.email,
            name: "Admin User",
          };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "OWNER"; // Set default role for development
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role;
      (session as any).uid = token.uid;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
