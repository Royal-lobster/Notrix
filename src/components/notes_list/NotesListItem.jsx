import React from "react";
import styles from "./NotesListItem.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FeatherIcon from "feather-icons-react";
import LZUTF8 from "lzutf8";
import { motion } from "framer-motion";
import fetchWithTimeout from "../../lib/fetchWithTimeout";

function NotesListItem({ id, title, content, fullContent, color, date }) {
  const toastId = React.useRef(null);

  let createShareLink = async () => {
    toastId.current = toast.loading("Generating Link", { autoClose: false });

    console.log({ toastId: toastId.current });

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
      try {
        const response = await fetchWithTimeout(
          `https://tinyurl.com/api-create.php?url=${generatedURL}`
        );
        let shortenedURL = await response.text();
        if (shortenedURL && response.ok)
          navigator.clipboard.writeText(shortenedURL);
        else navigator.clipboard.writeText(generatedURL);
      } catch {
        navigator.clipboard.writeText(generatedURL);
      }
    }
    // if offline, copy long url and show toast
    else {
      // copy the url in the clipboard
      navigator.clipboard.writeText(generatedURL);
    }

    console.log(generatedURL);

    toast.update(toastId.current, {
      render: "Share Link Copied to clipboard",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      closeOnClick: true,
    });
  };

  return (
    <motion.div className={styles.container}>
      <ToastContainer position="bottom-center" theme="dark" />
      <div
        data-movable-handle
        className={styles.decor}
        style={{ backgroundColor: color, cursor: "move" }}
      ></div>
      <div className={styles.content_wrapper}>
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
    </motion.div>
  );
}

export default NotesListItem;
