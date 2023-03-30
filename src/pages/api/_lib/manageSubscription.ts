import { query as Q } from "faunadb";

import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";
import stripeFormatIsoDate from "./stripeFormatDate";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  const userRef = await fauna.query(
    Q.Select(
      "ref",
      Q.Get(Q.Match(Q.Index("idx_stripe_customer_id"), customerId))
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    customer_stripe: subscription.customer,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    price: subscription.items.data[0].price.unit_amount / 100,
    currency: subscription.items.data[0].price.currency,
    createdAt: stripeFormatIsoDate(subscription.created),
    start_date_subscription: stripeFormatIsoDate(
      subscription.current_period_start
    ),
    end_date_subscription: stripeFormatIsoDate(subscription.current_period_end),
    canceled_at: stripeFormatIsoDate(subscription.canceled_at),
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: stripeFormatIsoDate(subscription.cancel_at),
  };

  if (createAction) {
    await fauna.query(
      Q.If(
        Q.Not(Q.Exists(Q.Match(Q.Index("subscription_by_id"), subscriptionId))),
        Q.Create(Q.Collection("subscriptions"), { data: subscriptionData }),
        Q.Get(Q.Match(Q.Index("subscription_by_id"), subscriptionId))
      )
    );
  } else {
    await fauna.query(
      Q.Replace(
        Q.Select(
          "ref",
          Q.Get(Q.Match(Q.Index("subscription_by_id"), subscriptionId))
        ),
        { data: subscriptionData }
      )
    );
  }
}
