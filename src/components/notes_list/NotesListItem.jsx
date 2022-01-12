import React from "react";
import styles from "./NotesListItem.module.css";
import { abbreviateNumber } from "../../lib/abbreviateNumber";

function NotesListItem({ id }) {
  // get all directly stored notes details from local storage
  let Title = localStorage.getItem(`Title_${id}`);
  let Content = localStorage.getItem(`smde_${id}`);
  let Color = localStorage.getItem(`Color_${id}`);
  let NoteDate = localStorage.getItem(`Date_${id}`);

  // calculate word count from local storage
  let wordCount = abbreviateNumber(
    Content?.split(" ").filter((w) => w.trim() !== "").length
  );

  // get modified date from local storage
  let shottedDate = NoteDate ? new Date(NoteDate).toLocaleDateString() : "N/A";

  // if there is no title, show "Untitled"
  let noteTitle = Title ? Title : "Untitled";

  // if there is no content, show "No Content"
  let noteContent = Content
    ? Content?.substring(0, 150) + "..."
    : "A Fresh page. Click to edit";

  return (
    <a className={styles.titleLink} href={`/notes/${id}`}>
      <div className={styles.container}>
        <div className={styles.decor} style={{ backgroundColor: Color }}></div>
        <div className={styles.content_wraper}>
          <h2 className={styles.title}>{noteTitle}</h2>
          <p className={styles.content}>{noteContent}</p>
          <p className={styles.contentDetails}>
            <span>
              <b>{wordCount}</b> words
            </span>
            <span> Modified on {shottedDate}</span>
          </p>
        </div>
      </div>
    </a>
  );
}

export default NotesListItem;
