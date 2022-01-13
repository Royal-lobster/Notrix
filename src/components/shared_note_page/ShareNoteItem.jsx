import React from "react";
import styles from "./ShareNoteItem.module.css";
import { abbreviateNumber } from "../../lib/abbreviateNumber";

function ShareNoteItem({ title, data, hue }) {
  // calculate word count from local storage
  let wordCount = abbreviateNumber(
    data?.split(" ").filter((w) => w.trim() !== "").length
  );

  // if there is no content, show "No Content"
  let noteContent = data
    ? `${data.substring(0, 150)} ${data.length > 150 ? "..." : ""}`
    : "A Fresh page. Only title is available";

  let shortenedTitle = `${title?.substring(0, 150)} ${
    title?.length > 150 ? "..." : ""
  }`;
  return (
    <div className={styles.container}>
      <div
        className={styles.decor}
        style={{ backgroundColor: `hsl(${hue}, 80%, 80%)` }}
      ></div>
      <div className={styles.content_wraper}>
        <h2 className={styles.title}>{shortenedTitle}</h2>
        <p className={styles.content}>{noteContent}</p>
        <p className={styles.contentDetails}>
          <span>
            <b>{wordCount}</b> words
          </span>
        </p>
      </div>
    </div>
  );
}

export default ShareNoteItem;
