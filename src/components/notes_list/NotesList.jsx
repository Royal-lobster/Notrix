import React from "react";
import NotesListItem from "./NotesListItem";
import styles from "./NotesList.module.css";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";
import NoNotesDetected from "./NoNotesDetected";

export default function NotesList({ createNotes, deleteNote }) {
  // get ids from local storage
  let ids = JSON.parse(localStorage.getItem("ids_array")) || [];
  return (
    <>
      <div className={styles.wrapper}>
        <NavBar createNotes={createNotes} />
        <div className={styles.container}>
          {ids.length !== 0 && (
            <h1 className={styles.SavedNotesText}>💾 Your Saved Notes</h1>
          )}
          {
            // Map through all Notes if ids array has any ids
            ids.length ? (
              ids
                .slice(0)
                .reverse()
                .map((id) => {
                  // Render NotesListItem for each id
                  if (
                    localStorage.getItem(`Title_${id}`) ||
                    localStorage.getItem(`smde_${id}`) !== null
                  )
                    return <NotesListItem id={id} key={id} />;
                  // if both title and content are empty delete it
                  else return deleteNote(id);
                })
            ) : (
              // if there are no items in ids array then show fresh start message
              <NoNotesDetected />
            )
          }
        </div>
      </div>
      <Footer />
    </>
  );
}
