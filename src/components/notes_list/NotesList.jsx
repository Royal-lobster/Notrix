import React, { useState, useEffect } from "react";
import NotesListItem from "./NotesListItem";
import styles from "./NotesList.module.css";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";
import NoNotesDetected from "./NoNotesDetected";
import Localbase from "localbase";
import { motion } from "framer-motion";
import { List, arrayMove } from "react-movable";

export const buttonStyles = {
  border: "none",
  margin: 0,
  padding: 0,
  width: "auto",
  overflow: "visible",
  cursor: "pointer",
  background: "transparent",
};

export default function NotesList({ createNotes, deleteNote }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // initialize ids array and localbase
  let db = new Localbase();

  let reOrderIds = (notes) => {
    let newOrder = notes.map((note) => note.id);
    // update the new order in IndexedDB
    db.collection("order").doc({ id: 0 }).set({
      id: 0,
      order: newOrder,
    });
  };

  // get ids from IndexedDB and store in ids array
  useEffect(() => {
    let cleanAndSetItems = (note) => {
      // if note either has title or content allow it
      if (note.title || note.content) {
        // if note has no title and modifed empty content delete it
        if (!note.title && note.content === `\\\n`) deleteNote(note.id);
        else return note;
      }
      // if note has empty Title and Content, delete it
      else deleteNote(note.id);
    };

    let getOrderFromIndexedDB = async () => {
      let orderData = await db.collection("order").get();
      // if no order data is present in indexedDB, create one
      if (orderData.length === 0) {
        await db.collection("order").add({
          id: 0,
        });

        // get all notes without order
        let notesData = await db.collection("notes").get();
        let AllNotes = [];
        await notesData.forEach((note) => {
          AllNotes.push(cleanAndSetItems(note));
        });
        setItems(AllNotes);
        reOrderIds(AllNotes);
      }

      // if order data is present in indexedDB, fetch notes in order
      else {
        let order = orderData[0].order;
        let AllOrderedNotes = [];
        order.forEach((id) => {
          db.collection("notes")
            .doc({ id: id })
            .get()
            .then((note) => {
              setItems((prevItems) => [...prevItems, cleanAndSetItems(note)]);
            });
        });
      }
    };
    getOrderFromIndexedDB();
    setLoading(false);
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <NavBar
          createNotes={createNotes}
          showSearchBar
          isNotesPresent={items.length !== 0}
        />
        <div className={styles.container}>
          {items.length !== 0 && !loading && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.SavedNotesText}
            >
              💾 Your Saved Notes
            </motion.h1>
          )}
          {
            // Map through all Notes if ids array has any ids
            items.length !== 0 && !loading ? (
              <List
                values={items}
                onChange={({ oldIndex, newIndex }) => {
                  let newItems = arrayMove(items, oldIndex, newIndex);
                  setItems(newItems);
                  // update the order of notes Ids in IndexedDB
                  reOrderIds(newItems);
                }}
                renderList={({ children, props }) => (
                  <div style={{ width: "100%" }} {...props}>
                    {children}
                  </div>
                )}
                renderItem={({ value, props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      border: "2px solid transparent",
                    }}
                  >
                    <NotesListItem
                      id={value.id}
                      key={value.id}
                      setIds={setItems}
                      title={
                        value.title
                          ? `${value.title?.substring(0, 150)} ${
                              value.title?.length > 150 ? "..." : ""
                            }`
                          : "Untitled"
                      }
                      content={
                        value.content
                          ? `${value.content?.substring(0, 150)} ${
                              value.content?.length > 150 ? "..." : ""
                            }`
                          : "A Fresh page. Click to edit"
                      }
                      fullContent={value.content}
                      color={value.color}
                      date={
                        value.date
                          ? new Date(value.date).toLocaleTimeString([], {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"
                      }
                    />
                  </div>
                )}
              />
            ) : (
              // if there are no items in ids array then show fresh start message
              <motion.div
                transition={{ default: { duration: 0.5 } }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <NoNotesDetected />
              </motion.div>
            )
          }
        </div>
      </div>
      <Footer />
    </>
  );
}
