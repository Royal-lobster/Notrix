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
  const [loading, setLoading] = useState(true);

  // initialize ids array and localbase
  let db = new Localbase();

  // get ids from IndexedDB and store in ids array
  useEffect(() => {
    db.collection("notes")
      .get()
      .then((notes) => {
        notes.forEach((note) => {
          if (note.title || note.content) {
            if (!note.title && note.content === `\\\n`) {
              deleteNote(note.id);
            } else setIds((prevIds) => [...prevIds, note.id]);
          }
          // if note has empty Title and Content, delete it
          else deleteNote(note.id);
          setLoading(false);
        });
      });
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <NavBar
          createNotes={createNotes}
          showSearchBar
          isNotesPresent={ids.length !== 0}
        />
        <div className={styles.container}>
          {ids.length !== 0 && !loading && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.SavedNotesText}
            >
              💾 Your Saved Notes
            </motion.h1>
          )}
          {
            // Map through all Notes if ids array has any ids
            ids.length !== 0 && !loading ? (
              ids.map((id) => (
                <NotesListItem id={id} key={id} setIds={setIds} />
              ))
            ) : (
              // if there are no items in ids array then show fresh start message
              <motion.div
                transition={{ default: { duration: 0.5 } }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <NoNotesDetected />
              </motion.div>
            )
          }
        </div>
      </div>
      <Footer />
    </>
  );
}
