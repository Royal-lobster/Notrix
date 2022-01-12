import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Dialog } from "@reach/dialog";
import useWindowSize from "../../lib/useWindowSize";
import TextareaAutosize from "react-textarea-autosize";
import Editor from "rich-markdown-editor";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";
import NoteControls from "./NoteControls";
import "@reach/dialog/styles.css";
import styles from "./Notes.module.css";

export default function Notes({ deleteNote }) {
  //get id from prams in url
  let { id } = useParams();
  let [width] = useWindowSize();

  // retrieving storedTitle and storedNotesContent from local storage
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

  // initializing state for Notes content and title
  const [title, setTitle] = useState(storedTitle);
  const [isLocked, setIsLocked] = useState(false);
  const [noteColor, setNoteColor] = useState(storedPastelColor);
  const [showDialog, setShowDialog] = React.useState(false);

  // useEffect to update local storage when ever title and notesContent change
  useEffect(() => {
    localStorage.setItem(`Title_${id}`, title);
    localStorage.setItem(`Color_${id}`, noteColor);
    localStorage.setItem(`Date_${id}`, new Date().toLocaleString());
  }, [title, noteColor, id]);

  useEffect(() => {
    // lock the editor if content is present on first render
    if (localStorage.getItem(`smde_${id}`)?.trim()) {
      setIsLocked(true);
    }
    // trigger TextareaAutosize update for change in height of the textarea
    const triggerTitleResize = setTimeout(() => {
      let t = title;
      setTitle("⠀⠀");
      setTitle(t);
    }, 10);

    // remove timeout when component exit (though its unlikely to exit in 10ms)
    return () => clearTimeout(triggerTitleResize);
  }, [id]);

  let handleChangeNoteColor = () => {
    setNoteColor(`hsl(${Math.floor(Math.random() * 360)}, ${70}%, ${80}%)`);
  };

  return (
    <>
      {/* Modal Dialog for deleting notes */}
      <Dialog
        className={styles.deleteDialog}
        isOpen={showDialog}
        onDismiss={() => setShowDialog(false)}
        aria-label="Delete Note"
      >
        {/* Header of the Modal Dialog */}
        <div className={styles.deleteDialogHeader}>
          <h3>Delete Note ?</h3>
          <button
            className={styles.deleteDialogCloseBtn}
            onClick={() => setShowDialog(false)}
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        {/* Message of the Modal Dialog */}
        <p>
          Are you sure you want to delete this note ? Once deleted there is no
          going back
        </p>

        {/* Action Buttons for Modal Dialog for Ok and Delete */}
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
              deleteNote(id);
              setShowDialog(false);
            }}
          >
            Delete
          </button>
        </div>
      </Dialog>
      <div className={styles.wrapper}>
        <NavBar
          id={id}
          deleteNote={setShowDialog}
          showNoteControls={width > 800}
          isNotePage={true}
          isLocked={isLocked}
          setIsLocked={setIsLocked}
          noteColor={noteColor}
          handleChangeNoteColor={handleChangeNoteColor}
        />
        <div className={styles.containerWrapper}>
          <div className={styles.container}>
            {/* Notes Title Textarea - From react-textarea-autosize library */}
            <div className={styles.titleBoxWrapper}>
              <TextareaAutosize
                className={styles.titleBox}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter Title"
              />
            </div>
            {/* Notes Content - From rich-markdown-editor library */}
            <Editor
              placeholder="Start Typing..."
              id={id}
              defaultValue={storedNotesContent}
              value={storedNotesContent}
              className={styles.notesBox}
              dark={true}
              readOnly={isLocked}
              onChange={(value) => {
                const text = value();
                localStorage.setItem(`smde_${id}`, text);
                localStorage.setItem(`Date_${id}`, new Date().toLocaleString());
              }}
              type="text"
            />
            {/* On mobile devices, render NoteControls component at bottom instead of top */}
            {width <= 800 && (
              <div className={styles.footerControls}>
                <NoteControls
                  id={id}
                  isMobile={true}
                  isLocked={isLocked}
                  setIsLocked={setIsLocked}
                  deleteNote={setShowDialog}
                  noteColor={noteColor}
                  handleChangeNoteColor={handleChangeNoteColor}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Remove footer in mobile devices in favor of NoteControls at bottom */}
      {width >= 800 && <Footer />}
    </>
  );
}
