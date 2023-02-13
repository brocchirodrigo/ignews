import Image from "next/image";
import Link from "next/link";

import styles from "./styles.module.scss";
import { SignInButton } from "./SignInButton";

export function Header() {
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Image src="/logo.svg" alt="Logo" width="90" height="90" />
          <nav>
            <Link className={styles.active} href="/">
              Home
            </Link>
            <Link className={styles.active} href="/post">
              Posts
            </Link>
          </nav>

          <SignInButton />
        </div>
      </header>
    </>
  );
}
