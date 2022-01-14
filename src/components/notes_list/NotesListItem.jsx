import React, { useState, useEffect } from "react";
import styles from "./NotesListItem.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FeatherIcon from "feather-icons-react";
import LZUTF8 from "lzutf8";
import Localbase from "localbase";

function NotesListItem({ id, setIds }) {
  // initialize localbase
  let db = new Localbase();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fullContent, setFullContent] = useState("");
  const [color, setColor] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    db.collection("notes")
      .doc({ id: id })
      .get()
      .then((note) => {
        // set initial content, color and title
        setTitle(
          note.title
            ? `${note.title?.substring(0, 150)} ${
                note.title?.length > 150 ? "..." : ""
              }`
            : "Untitled"
        );
        setFullContent(note.content);
        setContent(
          note.content
            ? `${note.content?.substring(0, 150)} ${
                note.content?.length > 150 ? "..." : ""
              }`
            : "A Fresh page. Click to edit"
        );
        setColor(note.color);
        setDate(
          note.date
            ? new Date(note.date).toLocaleTimeString([], {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"
        );
      })
      .catch((error) => {
        setIds((prevIds) => prevIds.filter((pid) => pid !== id));
      });

    // If title and content are empty, remove from IDs array
  }, []);

  let createShareLink = async () => {
    // if there is no title, show "Untitled"
    let noteTitle = title ? encodeURIComponent(title.trim()) : "Untitled";

    // if there is content, compress it, else compress nothing
    let compressedContent = fullContent
      ? await LZUTF8.compress(fullContent, {
          outputEncoding: "Base64",
        })
      : "A Fresh page. Only title is available";

    // color only select h value in hsl
    let hue = color.split("(")[1].split(")")[0].split(",")[0];

    // create share link
    let generatedURL = `${window.location.origin}/share?title=${noteTitle}&color=${hue}&data=${compressedContent}`;

    // shorten generated link if online
    if (navigator.onLine) {
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
    }
    // if offline, copy long url and show toast
    else {
      // copy the url in the clipboard
      navigator.clipboard.writeText(generatedURL);
      // show toast
      toast.success("Share Link Copied to clipboard");
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="bottom-center" theme="dark" />
      <div className={styles.decor} style={{ backgroundColor: color }}></div>
      <div className={styles.content_wraper}>
        <a className={styles.titleLink} href={`/notes/${id}`}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.content}>{content}</p>
        </a>
        <p className={styles.contentDetails}>
          <span>
            <FeatherIcon icon="clock" size={15} /> {date}
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
