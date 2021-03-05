import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./Notes.module.css";
import { useParams } from "react-router";

export default function Notes({ ids_array, setIds_array, history }) {
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

  // delete note
  let deleteNote = () => {
    const index = ids_array.indexOf(id);
    if (index > -1) {
      let newIds_array = ids_array.splice(index, 1);
      localStorage.setItem("ids_array", JSON.stringify(newIds_array));
      history.push(`/`);
      console.log(localStorage.getItem("ids_array"));
    }
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
      </div>
      <button onClick={deleteNote}>Delete Note</button>
    </div>
  );
}
