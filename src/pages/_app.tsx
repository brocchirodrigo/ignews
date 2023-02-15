import { AppProps } from "next/app";

import "../styles/global.scss";

import { Roboto } from "@next/font/google";
import { Header } from "../components/Header";

import { SessionProvider } from "next-auth/react";

const roboto = Roboto({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["sans-serif"],
  variable: "--roboto-font",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <main className={roboto.className}>
          <Header />
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </>
  );
}
