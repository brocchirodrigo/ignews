import { Client } from "faunadb";

export const fauna = new Client({
  secret: process.env.FAUNADB_SECRET,
  domain: process.env.FAUNADB_LOCALE,
});
