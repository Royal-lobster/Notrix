import React, { useEffect, useState, useRef } from "react";
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
import Localbase from "localbase";
import { motion } from "framer-motion";
import Scrollbars from "react-custom-scrollbars";

export default function Notes({ deleteNote }) {
  // initialize localbase
  let db = new Localbase();

  //get id from prams in url
  let { id } = useParams();
  let [width] = useWindowSize();
  const scrollbar = useRef(null);

  // initializing state for Notes content and title
  const [title, setTitle] = useState();
  const [initialStoredContent, setInitialStoredContent] = useState();
  const [isLocked, setIsLocked] = useState(false);
  const [noteColor, setNoteColor] = useState();
  const [showDialog, setShowDialog] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [isNoteControlsStickedAtTop, setIsNoteControlsStickedAtTop] =
    useState(false);

  // useEffect to update indexedDB when ever title and color change
  useEffect(() => {
    db.collection("notes").doc({ id: id }).update({
      title: title,
      color: noteColor,
    });
  }, [title, noteColor, id]);

  useEffect(() => {
    // retrieving notes from indexedDB
    db.collection("notes")
      .doc({ id: id })
      .get()
      .then((note) => {
        // lock the editor if content is present on first render
        if (note.content) {
          setIsLocked(true);
        }
        // set initial content, color and title
        setTitle(note.title);
        setNoteColor(
          note.color ||
            `hsl(${Math.floor(Math.random() * 360)}, ${70}%, ${80}%)`
        );
        setInitialStoredContent(note.content || "");
        setLoading(false);
      });
  }, [id]);

  let handleChangeNoteColor = () => {
    setNoteColor(`hsl(${Math.floor(Math.random() * 360)}, ${70}%, ${80}%)`);
  };
  const scrollToTop = () => {
    if (!scrollbar || !scrollbar.current) {
      return;
    }
    scrollbar.current.view.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  let handleShowDeleteDialog = () => {
    setShowDialog(true);
    scrollToTop();
  };

  return (
    <Scrollbars
      ref={scrollbar}
      onScrollFrame={(e) => {
        if (e.top > 0.03) setIsNoteControlsStickedAtTop(true);
        else setIsNoteControlsStickedAtTop(false);
        if (showDialog) e.scrollToTop();
      }}
      style={{ width: "100vw", height: "100vh" }}
    >
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
          deleteNote={handleShowDeleteDialog}
          showNoteControls={width > 800 && loading === false}
          isNotePage={true}
          isLocked={isLocked}
          setIsLocked={setIsLocked}
          noteColor={noteColor}
          handleChangeNoteColor={handleChangeNoteColor}
          isStickedAtTop={isNoteControlsStickedAtTop}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.containerWrapper}
        >
          {!loading && (
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
                defaultValue={initialStoredContent}
                value={initialStoredContent}
                className={styles.notesBox}
                dark={true}
                readOnly={isLocked}
                type="text"
                onChange={(value) => {
                  let text = value();
                  let currentTime = new Date().toLocaleString();
                  db.collection("notes").doc({ id: id }).update({
                    content: text,
                    date: currentTime,
                  });
                }}
              />
              {/* On mobile devices, render NoteControls component at bottom instead of top */}
              {width <= 800 && (
                <div className={styles.footerControls}>
                  <NoteControls
                    id={id}
                    isMobile={true}
                    isLocked={isLocked}
                    setIsLocked={setIsLocked}
                    deleteNote={handleShowDeleteDialog}
                    noteColor={noteColor}
                    handleChangeNoteColor={handleChangeNoteColor}
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
      {/* Remove footer in mobile devices in favor of NoteControls at bottom */}
      {width >= 800 && !loading && <Footer />}
    </Scrollbars>
  );
}
