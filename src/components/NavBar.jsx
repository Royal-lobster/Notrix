import React from "react";
import styles from "./NavBar.module.css";

export default function NavBar({ createNotes }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.branding}>Notrix</h2>
      <button className={styles.createNotesBtn} onClick={createNotes}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.createNotesIcon}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </button>
    </div>
  );
}
