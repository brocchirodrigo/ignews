import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { query as Q } from "faunadb";

import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { email, name } = user;

      try {
        await fauna.query(
          Q.If(
            Q.Not(Q.Exists(Q.Match(Q.Index("idx_email"), email))),
            Q.Create(Q.Collection("users"), { data: { email, name } }),
            Q.Get(Q.Match(Q.Index("idx_email"), email))
          )
        );

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  },
});
