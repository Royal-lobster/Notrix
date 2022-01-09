import React, { useEffect, useState } from "react";
import { abbreviateNumber } from "../lib/abbreviateNumber";
import Button from "./general_components/Button";
import styles from "./NoteControls.module.css";

function NoteControls({
  deleteNote,
  toggleLock,
  setToggleLock,
  mobile,
  pastelColor,
  id,
  changeRandomPastelColor,
}) {
  let [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    // get word count from note for first render
    setWordCount(
      abbreviateNumber(
        localStorage
          .getItem(`smde_${id}`)
          ?.split(" ")
          .filter((w) => w.trim() !== "").length || 0
      )
    );

    // set up a listener for changes to note
    let handleUserKeyPress;

    //if the note is locked, don't count the words
    if (toggleLock) {
      window.removeEventListener("keydown", handleUserKeyPress);
    } else {
      handleUserKeyPress = (e) => {
        if (
          e.keyCode === 32 ||
          e.keyCode === 8 ||
          e.keyCode === 9 ||
          e.keyCode === 13 ||
          e.keyCode === 46
        ) {
          setWordCount(
            abbreviateNumber(
              localStorage
                .getItem(`smde_${id}`)
                ?.split(" ")
                .filter((w) => w.trim() !== "").length || 0
            )
          );
        }
      };
      window.addEventListener("keydown", handleUserKeyPress);
    }
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [toggleLock]);

  return (
    <div className={styles.container}>
      <Button
        text="Delete"
        icon="trash-2"
        outline
        color="#fa7272"
        onClick={() => deleteNote(true)}
      />
      <Button
        text="Color"
        icon="circle"
        outline
        color={pastelColor}
        onClick={changeRandomPastelColor}
      />
      {!mobile && <Button text={`${wordCount} words`} icon="clock" outline />}
      {toggleLock ? (
        <Button
          text="Locked"
          icon="lock"
          outline
          toggleColor="#bda24a"
          onClick={() => setToggleLock(!toggleLock)}
        />
      ) : (
        <Button
          text="Unlocked"
          icon="unlock"
          outline
          onClick={() => setToggleLock(!toggleLock)}
        />
      )}
    </div>
  );
}

export default NoteControls;
