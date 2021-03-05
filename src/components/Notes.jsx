import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./Notes.module.css";
export default function Notes({ id }) {
  //title state
  let storedTitle,
    storedNotesContent = "";
  localStorage.getItem(`Title_${id}`) == null
    ? (storedTitle = "")
    : (storedTitle = localStorage.getItem(`Title_${id}`));
  localStorage.getItem(`NotesContent_${id}`) == null
    ? (storedNotesContent = "")
    : (storedNotesContent = localStorage.getItem(`Title_${id}`));

  const [NotesContent, setNotesContent] = useState(storedNotesContent);
  const [title, setTitle] = useState(storedTitle);
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
