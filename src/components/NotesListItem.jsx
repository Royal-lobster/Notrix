import React from "react";
import styles from "./NotesListItem.module.css";
import { abbreviateNumber } from "../lib/abbreviateNumber";
function NotesListItem({ id }) {
  let Title = localStorage.getItem(`Title_${id}`);
  let Content = localStorage.getItem(`smde_${id}`);
  let Color = localStorage.getItem(`Color_${id}`);
  return (
    <a className={styles.titleLink} href={`/notes/${id}`}>
      <div className={styles.container}>
        <div className={styles.decor} style={{ backgroundColor: Color }}></div>
        <div className={styles.content_wraper}>
          <h2 className={styles.title}>{Title}</h2>
          <p className={styles.content}>{Content?.substring(0, 150) + "..."}</p>
          <p className={styles.contentDetails}>
            <span>
              <b>
                {abbreviateNumber(
                  localStorage
                    .getItem(`smde_${id}`)
                    ?.split(" ")
                    .filter((w) => w.trim() !== "").length
                )}
              </b>{" "}
              words{" "}
            </span>
            <span>
              {" "}
              Modified on{" "}
              {localStorage.getItem(`Date_${id}`)
                ? new Date(
                    localStorage.getItem(`Date_${id}`)
                  ).toLocaleDateString()
                : "N/A"}
            </span>
          </p>
        </div>
      </div>
    </a>
  );
}

export default NotesListItem;
