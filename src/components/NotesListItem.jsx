import React from "react";
import styles from "./NotesListItem.module.css";

function NotesListItem({ id }) {
  let Title = localStorage.getItem(`Title_${id}`);
  let Content = localStorage.getItem(`NotesContent_${id}`);

  if (Title != null && Content != null) {
    return (
      <div className={styles.container}>
        <div className={styles.decor}></div>
        <div className={styles.content_wraper}>
          <a className={styles.titleLink} href={`/notes/${id}`}>
            <h2 className={styles.title}>{Title}</h2>
          </a>
          <p className={styles.content}>{Content.substring(0, 200) + "..."}</p>
        </div>
      </div>
    );
  } else return <div className={styles.notfound}>Content Not Found</div>;
}

export default NotesListItem;
