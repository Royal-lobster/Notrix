import React, { useState, useEffect } from "react";
import Notes from "./components/Notes";
import { useHistory } from "react-router-dom";
import createUID from "create-unique-id";
import "./App.css";
import { Route, Switch } from "react-router";
import NotesList from "./components/NotesList";

function App() {
  // initalise ids array state
  const [ids, setIds] = useState([]);
  const history = useHistory();

  // fetch ids array from storage
  useEffect(() => {
    const stored_ids_array = JSON.parse(localStorage.getItem("ids_array"));
    if (stored_ids_array != null) setIds(stored_ids_array);
  }, []);

  // create Note Function
  let createNotes = () => {
    // create a new ID
    let newId = createUID(22);

    //add the new Created Id to an array
    let newIdsArray = ids.concat([newId]);

    //make the array as ids state and set it in localStorage
    setIds(newIdsArray);
    localStorage.setItem("ids_array", JSON.stringify(newIdsArray));

    //redirect to that notes page with new id created
    history.push(`/notes/${newId}`);
  };

  // delete Note Function
  let deleteNote = (note_id) => {
    //remove data from local storage
    localStorage.removeItem(`Title_${note_id}`);
    localStorage.removeItem(`smde_${note_id}`);
    localStorage.removeItem(`Date_${note_id}`);
    localStorage.removeItem(`Color_${note_id}`);

    //remove id from ids array
    let storedIdsArray = JSON.parse(localStorage.getItem("ids_array"));
    const index = storedIdsArray.indexOf(note_id);
    storedIdsArray.splice(index, 1);
    localStorage.setItem("ids_array", JSON.stringify(storedIdsArray));

    //set the new array as state
    setIds(storedIdsArray);

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
              <NotesList
                ids={ids}
                createNotes={createNotes}
                deleteNote={deleteNote}
              />
            )}
          />
          <Route
            path="/notes/:id"
            component={() => (
              <Notes deleteNote={deleteNote} history={history} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
