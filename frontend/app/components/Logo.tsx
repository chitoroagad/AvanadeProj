import React from "react";
import styles from "./Logo.module.css";
import Image from "next/image";

const Logo = () => {
  return (
    <div className={styles.logo}>
      <Image
        src="/logo.png"
        width={20}
        height={20}
        sizes="100vw"
        className={styles.logopic}
        alt="logo"
      />
      <div className={styles.logoText}>
        <p>
          JurisBUD<br></br>AI
        </p>
      </div>
    </div>
  );
};

export default Logo;
