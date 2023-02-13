import { AppProps } from "next/app";

import "../styles/global.scss";

import { Roboto } from "@next/font/google";
import { Header } from "../components/Header";

const roboto = Roboto({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["sans-serif"],
  variable: "--roboto-font",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <main className={roboto.className}>
        <Header />
        <Component {...pageProps} />
      </main>
    </>
  );
}
