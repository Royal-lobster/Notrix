import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./Notes.module.css";
import { useParams } from "react-router";
import SimpleMDE from "react-simplemde-editor";
import "../assets/markdownEditor.css";
export default function Notes({ deleteNote, history }) {
  //get id from prams in url
  let { id } = useParams();

  // retriving storedTitle and storedNotesContent from localstorage
  let storedTitle,
    storedNotesContent = "";
  localStorage.getItem(`Title_${id}`) == null
    ? (storedTitle = "")
    : (storedTitle = localStorage.getItem(`Title_${id}`));
  localStorage.getItem(`smde_${id}`) == null
    ? (storedNotesContent = "")
    : (storedNotesContent = localStorage.getItem(`smde_${id}`));

  // initalising state for Notes content and title
  const [notesContent, setNotesContent] = useState(storedNotesContent);
  const [title, setTitle] = useState(storedTitle);

  // useEffect to update local storage when ever title and notesContent change
  useEffect(() => {
    localStorage.setItem(`Title_${id}`, title);
  }, [title, id]);

  let goToHome = () => {
    //if the note is empty then delete the note
    if (
      localStorage.getItem(`Title_${id}`) &&
      localStorage.getItem(`smde_${id}`) === ""
    )
      deleteNote(id);

    //go to homepage
    history.push(`/`);
  };

  return (
    <div className={styles.container_wraper}>
      <div className={styles.container}>
        <div className={styles.titleBoxWraper}>
          <TextareaAutosize
            className={styles.titleBox}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter Title"
          />
        </div>
        <br />
        <SimpleMDE
          placeholder="Start Typing..."
          minRows={10}
          id={id}
          options={{
            autosave: {
              enabled: true,
              uniqueId: id,
              delay: 0,
            },
            toolbar: false,
            status: false,
            shortcuts: {
              togglePreview: "Ctrl-Alt-P",
            },
            placeholder: "Start Typing...",
          }}
          className={styles.notesBox}
          onChange={(e) => setNotesContent({ mdeValue: e })}
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
