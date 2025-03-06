import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "@/lib/axios";
import { type UserData } from "@/types/user";

const handler = NextAuth({
  secret: process.env.SECRET_KEY,
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) =>
        await axios
          .post("/user/login", {
            username: credentials?.username,
            password: credentials?.password,
          })
          .then(({ data }) => data)
          .catch((err) => {
            if (err.response) {
              throw new Error(err.response.data.errors[0].msg);
            } else if (err.code === "ECONNREFUSED") {
              throw new Error("Unable to connect to the server.");
            } else {
              throw new Error("Unexpected error:", err.message);
            }
          }),
    }),
  ],
  pages: {
    signIn: "/login",
  },
  // events: {
  //     signIn: async ({ user }) => {
  //         console.log(user);
  //         Cookies.set('appToken', user.appToken, { expires: 7, path: '/' });
  //     }
  // },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as UserData;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface Session {
    user: UserData & DefaultSession["user"];
  }
}
