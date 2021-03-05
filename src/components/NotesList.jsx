import React, { useState, useEffect } from "react";
import NotesListItem from "./NotesListItem";
import styles from "./NotesList.module.css";
import noNotesFoundImg from "../assets/noNotesFound.svg";

export default function NotesList() {
  // initalise ids array state
  const [ids, setIds] = useState([]);

  // fetch ids array from storage
  useEffect(() => {
    const stored_ids_array = JSON.parse(localStorage.getItem("ids_array"));
    if (stored_ids_array != null) setIds(stored_ids_array);
  }, []);

  return (
    <div className={styles.container}>
      {ids.length ? (
        [...new Set(ids)].map((id) => {
          if (
            localStorage.getItem(`Title_${id}`) &&
            localStorage.getItem(`NotesContent_${id}`) !== ""
          ) {
            return <NotesListItem id={id} />;
          }
        })
      ) : (
        <div className={styles.NoNotesDetectedContainer}>
          <img
            src={noNotesFoundImg}
            className="styles.noNotesFoundImg"
            width="300px"
          />
          <h1>No Notes detected</h1>
          <p>Click on + button at top right corner</p>
        </div>
      )}
    </div>
  );
}
