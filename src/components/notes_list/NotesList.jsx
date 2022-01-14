import React, { useState, useEffect } from "react";
import NotesListItem from "./NotesListItem";
import styles from "./NotesList.module.css";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";
import NoNotesDetected from "./NoNotesDetected";
import Localbase from "localbase";
import { motion } from "framer-motion";

export default function NotesList({ createNotes, deleteNote }) {
  const [ids, setIds] = useState([]);

  // initialize ids array and localbase
  let db = new Localbase();

  // get ids from IndexedDB and store in ids array
  useEffect(() => {
    db.collection("notes")
      .get()
      .then((notes) => {
        notes.forEach((note) => {
          if (note.title || note.content)
            setIds((prevIds) => [...prevIds, note.id]);
          // if note has empty Title and Content, delete it
          else deleteNote(note.id);
        });
      });
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <NavBar createNotes={createNotes} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.container}
        >
          {ids.length !== 0 && (
            <h1 className={styles.SavedNotesText}>💾 Your Saved Notes</h1>
          )}
          {
            // Map through all Notes if ids array has any ids
            ids.length !== 0 ? (
              ids.map((id) => (
                <NotesListItem id={id} key={id} setIds={setIds} />
              ))
            ) : (
              // if there are no items in ids array then show fresh start message
              <NoNotesDetected />
            )
          }
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
