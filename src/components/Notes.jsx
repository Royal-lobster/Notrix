import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./Notes.module.css";
import { useParams } from "react-router";
import Editor from "rich-markdown-editor";
import "../assets/markdownEditor.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import useWindowSize from "../lib/useWindowSize";
import NoteControls from "./NoteControls";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

export default function Notes({ deleteNote, createNotes, history }) {
  //get id from prams in url
  let { id } = useParams();
  let [width] = useWindowSize();

  // retriving storedTitle and storedNotesContent from localstorage
  let storedTitle, storedPastelColor, storedNotesContent;
  localStorage.getItem(`Title_${id}`) == null
    ? (storedTitle = "")
    : (storedTitle = localStorage.getItem(`Title_${id}`));
  localStorage.getItem(`smde_${id}`) == null
    ? (storedPastelColor = `hsl(${Math.floor(
        Math.random() * 360
      )}, ${70}%, ${80}%)`)
    : (storedPastelColor = localStorage.getItem(`Color_${id}`));
  localStorage.getItem(`smde_${id}`) == null
    ? (storedNotesContent = "")
    : (storedNotesContent = localStorage.getItem(`smde_${id}`));

  // initalising state for Notes content and title
  const [title, setTitle] = useState(storedTitle);
  const [toggleLock, setToggleLock] = useState(false);
  const [pastelColor, setPastelColor] = useState(storedPastelColor);
  const [showDialog, setShowDialog] = React.useState(false);

  // useEffect to update local storage when ever title and notesContent change
  useEffect(() => {
    localStorage.setItem(`Title_${id}`, title);
    localStorage.setItem(`Color_${id}`, pastelColor);
    localStorage.setItem(`Date_${id}`, new Date().toLocaleString());
  }, [title, pastelColor, id]);

  useEffect(() => {
    if (localStorage.getItem(`smde_${id}`)?.trim()) {
      setToggleLock(true);
    }
    setTimeout(() => {
      let t = title + " !";
      setTitle(t);
    }, 1000);
  }, []);

  let changeRandomPastelColor = () => {
    setPastelColor(`hsl(${Math.floor(Math.random() * 360)}, ${70}%, ${80}%)`);
  };

  return (
    <>
      {/* -------------------------------------------------- */}
      <Dialog
        className={styles.deleteDialog}
        isOpen={showDialog}
        onDismiss={() => setShowDialog(false)}
      >
        <div className={styles.deleteDialogHeader}>
          <h3>Delete Note ?</h3>
          <button
            className={styles.deleteDialogCloseBtn}
            onClick={() => setShowDialog(false)}
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        <p>
          Are you sure you want to delete this note ? Once deleted there is no
          going back
        </p>
        <div className={styles.deleteDialogButtonWrapper}>
          <button
            className={styles.deleteDialogDenyBtn}
            onClick={() => {
              setShowDialog(false);
            }}
          >
            No
          </button>
          <button
            className={styles.deleteDialogConfirmBtn}
            onClick={() => {
              deleteNote();
              setShowDialog(false);
            }}
          >
            Delete
          </button>
        </div>
      </Dialog>
      {/* --------------------------------------------------- */}
      <NavBar
        notePage
        createNotes={createNotes}
        showNoteControls={width > 800}
        toggleLock={toggleLock}
        setToggleLock={setToggleLock}
        deleteNote={setShowDialog}
        id={id}
        pastelColor={pastelColor}
        changeRandomPastelColor={changeRandomPastelColor}
      />
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
          <Editor
            placeholder="Start Typing..."
            id={id}
            defaultValue={storedNotesContent}
            value={storedNotesContent}
            className={styles.notesBox}
            dark={true}
            readOnly={toggleLock}
            onChange={(value) => {
              const text = value();
              localStorage.setItem(`smde_${id}`, text);
              localStorage.setItem(`Date_${id}`, new Date().toLocaleString());
            }}
            type="text"
          />
          {width < 800 && (
            <div className={styles.footerControls}>
              <NoteControls
                mobile
                toggleLock={toggleLock}
                setToggleLock={setToggleLock}
                deleteNote={setShowDialog}
                pastelColor={pastelColor}
                id={id}
                changeRandomPastelColor={changeRandomPastelColor}
              />
            </div>
          )}
        </div>
      </div>
      {width >= 800 && <Footer />}
    </>
  );
}
