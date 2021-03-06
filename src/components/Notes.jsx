import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./Notes.module.css";
import { useParams } from "react-router";

export default function Notes({ deleteNote, history }) {
  let { id } = useParams();

  // retriving storedTitle and storedNotesContent from localstorage
  let storedTitle,
    storedNotesContent = "";
  localStorage.getItem(`Title_${id}`) == null
    ? (storedTitle = "")
    : (storedTitle = localStorage.getItem(`Title_${id}`));
  localStorage.getItem(`NotesContent_${id}`) == null
    ? (storedNotesContent = "")
    : (storedNotesContent = localStorage.getItem(`NotesContent_${id}`));

  // initalising state for Notes content and title
  const [NotesContent, setNotesContent] = useState(storedNotesContent);
  const [title, setTitle] = useState(storedTitle);

  // useEffect to update local storage when ever title and notesContent change
  useEffect(() => {
    localStorage.setItem(`Title_${id}`, title);
  }, [title, id]);
  useEffect(() => {
    localStorage.setItem(`NotesContent_${id}`, NotesContent);
  }, [NotesContent, id]);

  let goToHome = () => {
    //if the note is empty then delete the note
    if (
      localStorage.getItem(`Title_${id}`) &&
      localStorage.getItem(`NotesContent_${id}`) === ""
    )
      deleteNote(id);

    //go to homepage
    history.push(`/`);
  };
  return (
    <div className={styles.container_wraper}>
      <div className={styles.container}>
        <TextareaAutosize
          className={styles.titleBox}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Enter Title"
        />
        <br />
        <TextareaAutosize
          placeholder="Start Typing..."
          minRows={10}
          className={styles.notesBox}
          value={NotesContent}
          onChange={(e) => setNotesContent(e.target.value)}
          type="text"
        />
        <div className={styles.notesBtnsContainer}>
          <button onClick={goToHome} className={styles.backBtn}>
            Back to Home
          </button>
          <button
            onClick={() => deleteNote(id)}
            className={styles.deleteNoteBtn}
          >
            Delete Note
          </button>
        </div>
        <div className={styles.saveMessage}>
          {" "}
          Notes are saved Automatically in Browser
        </div>
      </div>
    </div>
  );
}
