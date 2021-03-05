import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import nextId from "react-id-generator";
import styles from "./NavBar.module.css";

export default function NavBar() {
  // initalise ids array state
  const [ids, setIds] = useState([]);
  const history = useHistory();

  // fetch ids array from storage
  useEffect(() => {
    const stored_ids_array = JSON.parse(localStorage.getItem("ids_array"));
    if (stored_ids_array != null) setIds(stored_ids_array);
  }, []);

  let createNotes = () => {
    let newId = nextId();
    setIds([...ids, newId]);
    localStorage.setItem("ids_array", JSON.stringify(ids));
    history.push(`/notes/${newId}`);
  };
  return (
    <div class={styles.container}>
      <h2 className={styles.branding}>Notrix</h2>
      <button className={styles.createNotesBtn} onClick={createNotes}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class={styles.createNotesIcon}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </button>
    </div>
  );
}
