import React, { useState, useEffect } from "react";
import "./App.css";
import Notes from "./components/note_page/Notes";
import { useHistory } from "react-router-dom";
import createUID from "create-unique-id";
import { Route, Switch } from "react-router";
import NotesList from "./components/notes_list/NotesList";
import SharedNote from "./components/shared_note_page/SharedNote";
import Localbase from "localbase";
import { Scrollbars } from "react-custom-scrollbars";

function App() {
  const history = useHistory();
  // initialize localbase
  let db = new Localbase();

  // Migrate localStorage to indexedDB
  const storedIdsArray = JSON.parse(localStorage.getItem("ids_array"));

  if (storedIdsArray != null) {
    console.info("Migrating data from localStorage to indexedDB");

    // loop through ids array and store data in indexedDB
    storedIdsArray.forEach((id) => {
      console.info("adding note with id: ", id, " to indexedDB");
      db.collection("notes").add({
        id: id,
        title: localStorage.getItem(`Title_${id}`),
        content: localStorage.getItem(`smde_${id}`),
        date: localStorage.getItem(`Date_${id}`),
        color: localStorage.getItem(`Color_${id}`),
      });
    });
    console.info("Migration complete removing localStorage data");

    // remove ids array from local storage
    localStorage.clear();
  }

  // create Note Function
  let createNotes = () => {
    // create a new ID
    let newId = createUID(22);

    // add new ID to notes collection in IndexedDB
    db.collection("notes").add({
      id: newId,
    });

    //redirect to that notes page with new id created
    history.push(`/notes/${newId}`);
  };

  // delete Note Function
  let deleteNote = (note_id) => {
    //remove data from IndexedDB
    db.collection("notes").doc({ id: note_id }).delete();

    //go to homepage
    history.push(`/`);
  };

  return (
    <div>
      <div className="content">
        <Switch>
          <Route
            exact
            path="/"
            component={() => (
              <Scrollbars style={{ width: "100vw", height: "100vh" }}>
                <NotesList createNotes={createNotes} deleteNote={deleteNote} />
              </Scrollbars>
            )}
          />
          <Route
            path="/notes/:id"
            component={() => (
              <Notes deleteNote={deleteNote} history={history} />
            )}
          />
          <Route
            path="/share"
            component={() => (
              <SharedNote createNotes={createNotes} history={history} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
