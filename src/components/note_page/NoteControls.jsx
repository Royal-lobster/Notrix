import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { abbreviateNumber } from "../../lib/abbreviateNumber";
import Button from "../general_components/Button";
import styles from "./NoteControls.module.css";
import Localbase from "localbase";

function NoteControls({
  id,
  deleteNote,
  noteColor,
  isLocked,
  isMobile,
  setIsLocked,
  isStickedAtTop,
  handleChangeNoteColor,
}) {
  // initialize localbase
  let db = new Localbase();

  let [wordCount, setWordCount] = useState(0);
  // calculate word count on every valid keystroke
  useEffect(() => {
    let fetchWordCount = () => {
      db.collection("notes")
        .doc({ id: id })
        .get()
        .then((note) => {
          let storedContent = note.content;
          let separatedWords = storedContent?.split(/\s/);
          let cleanWords = separatedWords?.filter((w) => w.trim() !== "");
          setWordCount(abbreviateNumber(cleanWords?.length || 0));
        });
    };
    // get word count from note for first render
    fetchWordCount();

    // set up a listener for changes to note
    let handleUserKeyPress;

    //if the note is locked, don't count the words
    if (isLocked) {
      window.removeEventListener("keydown", handleUserKeyPress);
    } else {
      handleUserKeyPress = (e) => {
        // if any or enter, backspace, delete, v, x...
        // pressed, then count the words
        if ([32, 8, 9, 13, 46, 86, 88].includes(e.keyCode)) fetchWordCount();
      };
      window.addEventListener("keydown", handleUserKeyPress);
    }
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [isLocked]);

  return (
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.13 }}
      className={
        !isStickedAtTop ? styles.container : styles.containerWithBackground
      }
    >
      {/* =============== Delete Control Button =============== */}
      <Button
        text="Delete"
        icon="trash-2"
        outline
        color="#fa7272"
        onClick={deleteNote}
      />

      {/* ===============Color Control Button =============== */}
      <Button
        text="Color"
        icon="circle"
        outline
        color={noteColor}
        onClick={handleChangeNoteColor}
      />

      {/* =============== Word Counter Button =============== */}
      {!isMobile && <Button text={`${wordCount} words`} icon="clock" outline />}

      {/* =============== Locked Control Button =============== */}
      <Button
        text={isLocked ? "Locked" : "Unlocked"}
        icon={isLocked ? "lock" : "unlock"}
        outline
        toggleColor={isLocked ? "#bda24a" : "transparent"}
        onClick={() => setIsLocked(!isLocked)}
      />
    </motion.div>
  );
}

export default NoteControls;
