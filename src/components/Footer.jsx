import React from "react";
import styles from "./Footer.module.css";
function Footer() {
  return (
    <div className={styles.container}>
      <h4>
        Made by <a href="https://srujangurram.me">Srujan Gurram</a> with Reactjs
      </h4>
    </div>
  );
}

export default Footer;
