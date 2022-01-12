import React from "react";
import noNotesFoundImg from "../../assets/noNotesFound.svg";
import styles from "./NoNotesDetected.module.css";

function NoNotesDetected() {
  return (
    <div className={styles.container}>
      <img src={noNotesFoundImg} alt="No Notes Found" width="250px" />
      <h1>It's a Fresh Start !</h1>
      <p>Click on new note button at top right corner</p>
    </div>
  );
}

export default NoNotesDetected;
