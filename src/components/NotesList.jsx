import React from "react";
import NotesListItem from "./NotesListItem";
import styles from "./NotesList.module.css";
import noNotesFoundImg from "../assets/noNotesFound.svg";
import NavBar from "./NavBar";
import Footer from "./Footer";
import useWindowSize from "../lib/useWindowSize";

export default function NotesList({ ids, createNotes, deleteNote }) {
  let [width] = useWindowSize();
  return (
    <>
      <div className={styles.wrapper}>
        <NavBar createNotes={createNotes} />
        <div
          className={styles.container}
          style={
            width > 800
              ? { marginTop: "calc(15vh - 5vw)" }
              : { marginTop: "max(20px, 5vh)" }
          }
        >
          {ids.length != 0 && (
            <h1 className={styles.SavedNotesText}>💾 Your Saved Notes</h1>
          )}
          {
            // Map through all Notes if ids array has any ids
            ids.length ? (
              [...new Set(ids)].map((id) => {
                // if there is content in notes then show it
                if (
                  localStorage.getItem(`Title_${id}`) &&
                  localStorage.getItem(`smde_${id}`) !== ""
                ) {
                  return <NotesListItem id={id} key={id} />;
                }
                // else delete the notes if there is no title or note content
                else {
                  deleteNote(id);
                  return <div key={id}></div>;
                }
              })
            ) : (
              // if there are no items in ids array then return ntoes not Detected message
              <div
                className={styles.NoNotesDetectedContainer}
                style={{ padding: 20, textAlign: "center" }}
              >
                <img
                  src={noNotesFoundImg}
                  className="styles.noNotesFoundImg"
                  alt="No Notes Found"
                  width="250px"
                />
                <h1>It's a Fresh Start !</h1>
                <p>Click on new note button at top right corner</p>
              </div>
            )
          }
        </div>
      </div>
      <Footer />
    </>
  );
}
