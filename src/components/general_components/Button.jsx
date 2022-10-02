import React from "react";
import styles from "./Button.module.css";
import FeatherIcon from "feather-icons-react";

function Button({
  icon,
  text,
  outline,
  onClick,
  color,
  toggleColor,
  className,
}) {
  return (
    <button
      tabIndex="0"
      style={toggleColor && { backgroundColor: toggleColor }}
      className={`${
        outline ? styles.buttonOutline : styles.button
      } ${className}`}
      onClick={onClick}
    >
      <FeatherIcon
        icon={icon}
        color={toggleColor ? "#FFF" : color ? color : "#A3F7BF"}
        size="20"
      />
      {text && <div className={styles.text}>{text}</div>}
    </button>
  );
}

export default Button;
