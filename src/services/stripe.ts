import Stripe from "stripe";

// import { version } from '../../package.json'

const version = process.env.APP_VERSION;
const name = process.env.APP_NAME;

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2022-11-15",
  appInfo: {
    name,
    version,
  },
});
