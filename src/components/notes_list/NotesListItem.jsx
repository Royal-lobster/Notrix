import React from "react";
import styles from "./NotesListItem.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { abbreviateNumber } from "../../lib/abbreviateNumber";
import FeatherIcon from "feather-icons-react";
import LZUTF8 from "lzutf8";

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
  let shottedDate = NoteDate
    ? new Date(NoteDate).toLocaleTimeString([], {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  // if there is no title, show "Untitled"
  let noteTitle = Title ? Title : "Untitled";

  // if there is no content, show "No Content"
  let noteContent = Content
    ? Content?.substring(0, 150) + "..."
    : "A Fresh page. Click to edit";

  let createShareLink = async () => {
    // if there is no title, show "Untitled"
    let noteTitle = Title ? Title : "Untitled";

    // if there is content, compress it, else compress nothing
    let compressedContent = Content
      ? await LZUTF8.compress(Content, {
          outputEncoding: "Base64",
        })
      : "A Fresh page. Only title is available";

    // color only select h value in hsl
    let hue = Color.split("(")[1].split(")")[0].split(",")[0];

    // create share link
    let generatedURL = `${window.location.origin}/share?title=${noteTitle}&color=${hue}&data=${compressedContent}`;

    // shorten generated link
    const response = await toast.promise(
      fetch("https://api.tinyurl.com/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TINYURL_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: generatedURL,
        }),
      }),
      {
        pending: "Generating Share link",
        success: "Share Link Copied to Clipboard",
      }
    );
    const body = await response.json();

    // copy the url in the clipboard
    if (body?.data?.tiny_url) {
      navigator.clipboard.writeText(body.data.tiny_url);
    } else {
      navigator.clipboard.writeText(generatedURL);
      // show toast
      toast.success("Share Link Copied to clipboard");
    }
  };
  return (
    <div className={styles.container}>
      <ToastContainer position="bottom-center" theme="dark" />
      <div className={styles.decor} style={{ backgroundColor: Color }}></div>
      <div className={styles.content_wraper}>
        <a className={styles.titleLink} href={`/notes/${id}`}>
          <h2 className={styles.title}>{noteTitle}</h2>
          <p className={styles.content}>{noteContent}</p>
        </a>
        <p className={styles.contentDetails}>
          <span>
            {" "}
            <FeatherIcon icon="clock" size={15} /> {shottedDate}
          </span>
          <span className={styles.shareBtn} onClick={createShareLink}>
            <FeatherIcon icon="share" size={15} /> Share
          </span>
        </p>
      </div>
    </div>
  );
}

export default NotesListItem;
