import React from "react";
import Notes from "./components/Notes";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Route, Switch } from "react-router";
import NotesList from "./components/NotesList";
function App() {
  return (
    <div>
      <NavBar />
      <div className="content">
        <Switch>
          <Route exact path="/" component={NotesList} />
          <Route path="/notes/:id" component={Notes} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

export default App;
