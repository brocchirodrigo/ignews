import Image from "next/image";

import styles from "./styles.module.scss";
import { SignInButton } from "../SignInButton";

import { ActiveLink } from "../ActiveLink";

export function Header() {
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Image src="/logo.svg" alt="Logo" width="110" height="31" />
          <nav>
            <ActiveLink activeClassName={styles.active} href="/">
              Home
            </ActiveLink>
            <ActiveLink activeClassName={styles.active} href="/posts">
              Posts
            </ActiveLink>
          </nav>

          <SignInButton />
        </div>
      </header>
    </>
  );
}
