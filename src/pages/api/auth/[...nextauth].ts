import NextAuth from "next-auth";

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { query as Q } from "faunadb";

import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      const { email, name, image } = user;
      const { provider } = account;

      try {
        await fauna.query(
          Q.If(
            Q.Not(Q.Exists(Q.Match(Q.Index("idx_email"), email))),
            Q.Create(Q.Collection("users"), {
              data: { email, name, provider, image },
            }),
            Q.Get(Q.Match(Q.Index("idx_email"), email))
          )
        );

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      try {
        const userActiveSubscription = await fauna.query<string>(
          Q.Get(
            Q.Intersection([
              Q.Match(
                Q.Index("subscription_by_user_ref"),
                Q.Select(
                  "ref",
                  Q.Get(
                    Q.Match(
                      Q.Index("idx_email"),
                      Q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              Q.Match(Q.Index("subscription_status"), "active"),
            ])
          )
        );

        return { ...session, activeSubscription: userActiveSubscription };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
});
