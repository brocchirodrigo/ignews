import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { query as Q } from "faunadb";

import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
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
  },
});
