import React from "react";
import NotesListItem from "./NotesListItem";
import styles from "./NotesList.module.css";
import noNotesFoundImg from "../assets/noNotesFound.svg";

export default function NotesList({ ids }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.SavedNotesText}>💾 Your Saved Notes</h1>
      {ids.length ? (
        [...new Set(ids)].map((id) => {
          if (
            localStorage.getItem(`Title_${id}`) &&
            localStorage.getItem(`NotesContent_${id}`) !== ""
          ) {
            return <NotesListItem id={id} key={id} />;
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
