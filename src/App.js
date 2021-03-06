import React, { useState, useEffect } from "react";
import Notes from "./components/Notes";
import { useHistory } from "react-router-dom";
import createUID from "create-unique-id";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
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

  let createNotes = () => {
    let newId = createUID(22);
    let newIdsArray = ids.concat([newId]);
    setIds(newIdsArray);
    localStorage.setItem("ids_array", JSON.stringify(newIdsArray));
    history.push(`/notes/${newId}`);
    console.log(`New Id Created: ${newId}`);
    console.log(`Local Storage: ${localStorage.getItem("ids_array")}`);
  };
  return (
    <div>
      <NavBar createNotes={createNotes} />
      <div className="content">
        <Switch>
          <Route exact path="/" component={() => <NotesList ids={ids} />} />
          <Route
            path="/notes/:id"
            component={() => (
              <Notes ids_array={ids} setIds_array={setIds} history={history} />
            )}
          />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

export default App;
