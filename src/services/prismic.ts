import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";

import sm from "../../sm.json";

export const repositoryName = prismic.getRepositoryName(sm.apiEndpoint);

const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

const options: prismicNext.CreateClientConfig = {
  accessToken,
};

export function getPrismicClient() {
  const client = prismic.createClient(repositoryName, options);

  return client;
}
