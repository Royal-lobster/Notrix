import React, { useState, useEffect } from "react";
import styles from "./Search.module.css";
import Localbase from "localbase";
import Fuse from "fuse.js";
import { useHistory } from "react-router-dom";

function Search() {
  // initialize localbase
  const history = useHistory();
  let db = new Localbase();
  const [results, setResults] = useState([]);
  let fuse;

  db.collection("notes")
    .get()
    .then((notes) => {
      fuse = new Fuse(notes, {
        keys: ["title", "content"],
      });
    });

  let filterSearchQuery = (query) => {
    if (query.length > 0) setResults(fuse.search(query).slice(0, 8));
    if (query.length <= 0) setResults([]);
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.searchBar}
        type="text"
        onChange={(e) => {
          filterSearchQuery(e.target.value);
        }}
        placeholder="search for notes..."
      />
      {results.length > 0 && (
        <div className={styles.resultsContainer}>
          {results.map((result) => (
            <div
              className={styles.searchResult}
              key={result.item.id}
              onClick={() => history.push(`/notes/${result.item.id}`)}
            >
              <button className={styles.searchResultInnerContainer}>
                <div
                  className={styles.searchResultColor}
                  style={{ backgroundColor: result.item.color }}
                />
                {`${result.item.title?.substring(0, 50)} ${
                  result.item.title?.length > 50 ? "..." : ""
                }`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
