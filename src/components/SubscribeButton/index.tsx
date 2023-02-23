import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";
import { useSession, signIn } from "next-auth/react";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { status } = useSession();

  const isUserLoggedIn = status === "authenticated" ? true : false;

  async function handleSubscribe() {
    if (!isUserLoggedIn) {
      await signIn("google");
      return;
    }

    try {
      const response = await api.post("/subscribe", {
        priceId,
      });

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.subscribeButton}
        onClick={handleSubscribe}
        disabled={!isUserLoggedIn}
      >
        Subscribe now
      </button>
      <br />
      {!isUserLoggedIn && (
        <div className={styles.needsLogin}>
          <span> * </span> You must be logged in to subscribe. Click login
          button first 👆
        </div>
      )}
    </>
  );
}
