import React from "react";
import { useHistory } from "react-router";
import Button from "./general_components/Button";
import styles from "./NavBar.module.css";
import NoteControls from "./NoteControls";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
export default function NavBar({
  notePage,
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
  const [toggleNavTransparent, setToggleNavTransparent] = React.useState(false);

  useScrollPosition(({ prevPos, currPos }) => {
    if (Math.floor(currPos.y) < -100 && showNoteControls) {
      setToggleNavTransparent(true);
    } else {
      setToggleNavTransparent(false);
    }
  });

  return (
    <div
      className={notePage ? styles.topWrapper : styles.topWrapperNotesList}
      style={
        toggleNavTransparent
          ? {
              position: "sticky",
              top: 0,
              width: "100%",
              borderBottom: "none",
            }
          : {}
      }
    >
      <div
        className={styles.container}
        style={
          toggleNavTransparent
            ? {
                backgroundColor: "transparent",
                justifyContent: "center",
                padding: "10px 0",
              }
            : {}
        }
      >
        <h2
          className={styles.branding}
          style={
            toggleNavTransparent
              ? {
                  display: "none",
                }
              : {}
          }
          onClick={() => history.push("/")}
        >
          <div className={styles.brandingSymbol}>N</div>
          <div className={styles.brandingLettering}>Notrix</div>
        </h2>
        {showNoteControls && (
          <NoteControls
            deleteNote={deleteNote}
            toggleLock={toggleLock}
            id={id}
            setToggleLock={setToggleLock}
            toggleNavTransparent={toggleNavTransparent}
            pastelColor={pastelColor}
            changeRandomPastelColor={changeRandomPastelColor}
          />
        )}
        <div
          style={
            toggleNavTransparent
              ? {
                  display: "none",
                }
              : {}
          }
        >
          {notePage ? (
            <Button
              className={styles.createNotesBtn}
              onClick={() => history.push("/")}
              icon="home"
              text="All Notes"
            />
          ) : (
            <Button
              className={styles.createNotesBtn}
              onClick={createNotes}
              icon="pen-tool"
              text="New Note"
            />
          )}
        </div>
      </div>
    </div>
  );
}
