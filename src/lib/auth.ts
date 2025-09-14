import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    EmailProvider({
      // No SMTP needed in dev; we log the sign-in link to the server console.
      async sendVerificationRequest({ identifier, url }) {
        console.log("\\n—— Sign-in link for", identifier, "——\\n", url, "\\n");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        token.role = dbUser?.role ?? "ASSISTANT";
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
  events: {
    async signIn({ user }) {
      // First user becomes OWNER automatically if no owner exists
      const owner = await prisma.user.findFirst({ where: { role: "OWNER" } });
      if (!owner && user?.id) {
        await prisma.user.update({ where: { id: user.id }, data: { role: "OWNER" } });
      }
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
