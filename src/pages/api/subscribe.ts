import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/react";

import { stripe } from "../../services/stripe";

import { query as Q } from "faunadb";
import { fauna } from "../../services/fauna";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Update de assinatura para cancelar na data final
   */

  // await stripe.subscriptions.update("sub_1Mfm4ALTI7wXcRVSzclAAMqr", {
  //   cancel_at_period_end: true,
  // });

  if (req.method === "POST") {
    const session = await getSession({ req });

    const user = await fauna.query<User>(
      Q.Get(Q.Match(Q.Index("idx_email"), Q.Casefold(session.user.email)))
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        name: session.user.name,
        email: session.user.email,
      });

      await fauna.query(
        Q.Update(Q.Ref(Q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
            stripe_customer_name: session.user.name,
          },
        })
      );

      customerId = stripeCustomer.id;
    }

    const { priceId } = req.body;

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    /**
     * Update da forma de pagamento
     */
    //   const stripeCheckoutSession = await stripe.checkout.sessions.create({
    //     payment_method_types: ["card"],
    //     mode: "setup",
    //     customer: "cus_NQdKHUSBLYQaHI",
    //     setup_intent_data: {
    //       metadata: {
    //         customer_id: "cus_NQdKHUSBLYQaHI",
    //         subscription_id: "sub_1Mfm4ALTI7wXcRVSzclAAMqr",
    //       },
    //     },
    //     billing_address_collection: "required",
    //     success_url: process.env.STRIPE_SUCCESS_URL,
    //     cancel_url: process.env.STRIPE_CANCEL_URL,
    //   });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

export default subscribe;
