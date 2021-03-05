import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./Notes.module.css";
export default function Notes({ id }) {
  //set title
  if (localStorage.getItem(`Title_${id}`) == null) {
    const [title, setTitle] = useState("");
  } else {
    const [title, setTitle] = useState(localStorage.getItem(`Title_${id}`));
  }

  if (localStorage.getItem(`NotesContent_${id}`) == null) {
    const [title, setTitle] = useState("");
  } else {
    const [NotesContent, setNotesContent] = useState(
      localStorage.getItem(`NotesContent_${id}`)
    );
  }
  useEffect(() => {
    localStorage.setItem(`Title_${id}`, title);
  }, [title]);
  useEffect(() => {
    localStorage.setItem(`NotesContent_${id}`, NotesContent);
  }, [NotesContent]);

  return (
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
    </div>
  );
}
