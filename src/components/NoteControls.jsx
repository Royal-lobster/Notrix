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
    const interval = setInterval(() => {
      setWordCount(
        abbreviateNumber(
          localStorage
            .getItem(`smde_${id}`)
            ?.split(" ")
            .filter((w) => w.trim() !== "").length
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <Button
        text="Delete"
        icon="trash-2"
        outline
        color="#fa7272"
        onClick={deleteNote}
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
