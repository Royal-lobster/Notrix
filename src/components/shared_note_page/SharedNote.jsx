import React, { useState, useEffect } from "react";
import LZUTF8 from "lzutf8";
import ShareNoteItem from "./ShareNoteItem";
import styles from "./SharedNote.module.css";
import Button from "../general_components/Button";
import createUID from "create-unique-id";
import queryString from "query-string";

function SharedNote({ history }) {
  const [decodedData, setDecodedData] = useState("");
  const [queries, setQueries] = useState({});
  useEffect(() => {
    let decodeData = async () => {
      let fetchedQueries = queryString.parse(
        window.location.search.split("?")[1]
      );
      await setQueries(fetchedQueries);
      const compressed = /(?<=\&data=).*/g.exec(window.location.search)[0];
      const decompressed = await LZUTF8.decompress(compressed, {
        inputEncoding: "Base64",
      });
      setDecodedData(decompressed);
    };
    decodeData();
  }, []);

  let createLocalCopy = () => {
    // create a new id for the note
    let newId = createUID(22);

    // get current stored ids array
    let storedIdsArray = JSON.parse(localStorage.getItem("ids_array"));

    //add the new Created Id to an array
    let newIdsArray = storedIdsArray ? [...storedIdsArray, newId] : [newId];

    //make the array as ids state and set it in localStorage
    localStorage.setItem("ids_array", JSON.stringify(newIdsArray));

    //make Title, Color and Data set to localStorage
    localStorage.setItem(`Title_${newId}`, queries.title);
    localStorage.setItem(`Color_${newId}`, `hsl(${queries.color}, 70%, 80%)`);
    localStorage.setItem(
      `smde_${newId}`,
      `\n:::info\nFetched from Notrix Share\n\n:::\n\n${decodedData}`
    );
    localStorage.setItem(`Date_${newId}`, new Date().toLocaleString());

    //go to new notes page
    history.push(`/notes/${newId}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Branding of Application, at the left most side of nav */}
        <h2 className={styles.branding} onClick={() => history.push("/")}>
          <div className={styles.brandingSymbol}>N</div>
          <div className={styles.brandingLettering}>Notrix Share</div>
        </h2>

        {/* content preview */}
        <ShareNoteItem
          title={queries.title}
          hue={queries.color}
          data={decodedData}
        />

        {/* Save Message */}
        <p className={styles.saveMessage}>
          To view the shared content, you should save this note first. Do you
          want to save this to your Notrix ?{" "}
          <span>(You can always delete note later)</span>
        </p>

        {/* Save Button */}
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.saveButton}
            text="Save"
            icon="save"
            toggleColor="#1a73e8"
            onClick={() => {
              createLocalCopy();
            }}
          />
          <Button
            className={styles.saveButton}
            text="Cancel"
            icon="delete"
            toggleColor="#e74646"
            onClick={() => {
              history.push("/");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SharedNote;
