import React from "react";
import { useHistory } from "react-router";
import Button from "./general_components/Button";
import styles from "./NavBar.module.css";
import NoteControls from "./NoteControls";

export default function NavBar({
  createNotes,
  deleteNote,
  showNoteControls,
  toggleLock,
  setToggleLock,
  id,
  pastelColor,
  changeRandomPastelColor,
}) {
  const history = useHistory();
  return (
    <div className={styles.container}>
      <h2 className={styles.branding} onClick={() => history.push("/")}>
        <div className={styles.brandingSymbol}>N</div>
        <div className={styles.brandingLettering}>Notrix</div>
      </h2>
      {showNoteControls && (
        <NoteControls
          deleteNote={deleteNote}
          toggleLock={toggleLock}
          id={id}
          setToggleLock={setToggleLock}
          pastelColor={pastelColor}
          changeRandomPastelColor={changeRandomPastelColor}
        />
      )}
      <Button
        className={styles.createNotesBtn}
        onClick={createNotes}
        icon="pen-tool"
        text="New Note"
      />
    </div>
  );
}
