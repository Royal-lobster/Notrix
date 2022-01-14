import { motion } from "framer-motion";
import React from "react";
import styles from "./Footer.module.css";
function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ default: { duration: 0.3 } }}
      className={styles.container}
    >
      <h4>
        Made by{" "}
        <a className={styles.Footerlink} href="https://srujangurram.me">
          Srujan
        </a>
      </h4>
    </motion.div>
  );
}

export default Footer;
