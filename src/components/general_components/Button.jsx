import React from "react";
import styles from "./Button.module.css";
import FeatherIcon from "feather-icons-react";

function Button({ icon, text, outline, onClick, color, toggleColor }) {
  return (
    <a
      href="#"
      tabindex="0"
      style={toggleColor && { backgroundColor: toggleColor }}
      className={outline ? styles.buttonOutline : styles.button}
      onClick={onClick}
    >
      <FeatherIcon
        icon={icon}
        color={toggleColor ? "#FFF" : color ? color : "#A3F7BF"}
        size="20"
      />
      <div className={styles.text}>{text}</div>
    </a>
  );
}

export default Button;
