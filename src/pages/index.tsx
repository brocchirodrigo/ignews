import { GetStaticProps } from "next";

import Head from "next/head";
import Image from "next/image";

import styles from "../styles/home.module.scss";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import { useSession } from "next-auth/react";

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome!</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image src="./avatar.svg" alt="Avatar" width={336} height={521} />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1Mb8raLTI7wXcRVSGMtYNBZr", {
    expand: ["product"],
  });

  const formatPrice =
    price.currency === "brl"
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price.unit_amount / 100)
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price.unit_amount / 100);

  const product = {
    priceId: price.id,
    amount: formatPrice,
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
