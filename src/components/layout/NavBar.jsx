import React from "react";
import { useHistory } from "react-router";
import Button from "../general_components/Button";
import styles from "./NavBar.module.css";
import NoteControls from "../note_page/NoteControls";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
export default function NavBar({
  id,
  createNotes,
  deleteNote,
  isNotePage,
  isLocked,
  setIsLocked,
  showNoteControls,
  noteColor,
  handleChangeNoteColor,
}) {
  const history = useHistory();
  const [isStickedAtTop, setIsStickedAtTop] = React.useState(false);

  // Hook to listen to scroll changes and make note controls stick at top
  useScrollPosition(({ prevPos, currPos }) => {
    if (Math.floor(currPos.y) < -100 && showNoteControls) {
      setIsStickedAtTop(true);
    } else {
      setIsStickedAtTop(false);
    }
  });

  // Styles for fixing navbar at top for note controls accessability
  const fixNavTopWrapperStyles = {
    position: "sticky",
    top: 0,
    width: "100%",
    borderBottom: "none",
  };

  const fixNavTopContainerStyles = {
    backgroundColor: "transparent",
    justifyContent: "center",
    padding: "10px 0",
  };

  return (
    // Render Nav bar at top if note is not scrolled else fix the nav at top always
    <div
      className={isNotePage ? styles.topWrapper : styles.topWrapperNotesList}
      style={isStickedAtTop ? fixNavTopWrapperStyles : {}}
    >
      <div
        className={styles.container}
        style={isStickedAtTop ? fixNavTopContainerStyles : {}}
      >
        {/* Branding of Application, at the left most side of nav */}
        <h2
          className={styles.branding}
          style={isStickedAtTop ? { display: "none" } : {}}
          onClick={() => history.push("/")}
        >
          <div className={styles.brandingSymbol}>N</div>
          <div className={styles.brandingLettering}>Notrix</div>
        </h2>

        {/* If Note Controls to be shown, render it in middle of nav */}
        {showNoteControls && (
          <NoteControls
            id={id}
            deleteNote={deleteNote}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            isStickedAtTop={isStickedAtTop}
            noteColor={noteColor}
            handleChangeNoteColor={handleChangeNoteColor}
          />
        )}

        {/* render button at right most side. [New note] in homepage and [back btn] at notes page */}
        <div style={isStickedAtTop ? { display: "none" } : {}}>
          <Button
            className={styles.createNotesBtn}
            onClick={isNotePage ? () => history.push("/") : createNotes}
            icon={isNotePage ? "home" : "pen-tool"}
            text={isNotePage ? "All Notes" : "New Note"}
          />
        </div>
      </div>
    </div>
  );
}
