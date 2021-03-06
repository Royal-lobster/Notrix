import React from "react";
import styles from "./NotesListItem.module.css";

function NotesListItem({ id }) {
  let Title = localStorage.getItem(`Title_${id}`);
  let Content = localStorage.getItem(`NotesContent_${id}`);
  return (
    <a className={styles.titleLink} href={`/notes/${id}`}>
      <div className={styles.container}>
        <div className={styles.decor}></div>
        <div className={styles.content_wraper}>
          <h2 className={styles.title}>{Title}</h2>
          <p className={styles.content}>{Content.substring(0, 150) + "..."}</p>
        </div>
      </div>
    </a>
  );
}

export default NotesListItem;
