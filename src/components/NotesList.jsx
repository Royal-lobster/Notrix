import React, { useState } from "react";
import Notes from "./notes";
import nextId from "react-id-generator";
export default function notesList() {
  if (localStorage.getItem("ids_array") == null)
    localStorage.setItem("ids_array", []);
  const [ids, setIds] = useState(localStorage.getItem("ids_array"));
  let createNotes = () => {
    newId = nextId();
    setIds(ids.push(newId));
    localStorage.setItem("ids_array", ids);
  };
  return (
    <div>
      {ids ? ids.map((id) => <Notes id={id} />) : <div>No Notes detected</div>}
      <button onClick={createNotes}></button>
    </div>
  );
}
