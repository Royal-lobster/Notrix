import React from "react";
import styles from "./NavBar.module.css";
export default function NavBar() {
  return (
    <div class={styles.container}>
      <h2 className={styles.branding}>Notrix</h2>
    </div>
  );
}
