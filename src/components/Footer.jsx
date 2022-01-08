import React from "react";
import styles from "./Footer.module.css";
function Footer() {
  return (
    <div className={styles.container}>
      <h4>
        Made by{" "}
        <a className={styles.Footerlink} href="https://srujangurram.me">
          Srujan
        </a>
      </h4>
    </div>
  );
}

export default Footer;
