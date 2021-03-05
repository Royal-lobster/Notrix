import React from "react";
import Notes from "./components/Notes";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
function App() {
  return (
    <div>
      <NavBar />
      <Notes id={123} />
      <Footer />
    </div>
  );
}

export default App;
