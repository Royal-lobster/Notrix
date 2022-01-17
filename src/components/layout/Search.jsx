import React, { useState, useEffect } from "react";
import styles from "./Search.module.css";
import Localbase from "localbase";
import Fuse from "fuse.js";
import { useHistory } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

function Search() {
  // initialize localbase
  const history = useHistory();
  let db = new Localbase();
  const [results, setResults] = useState([]);
  const [queryShareUrl, setQueryShareURL] = useState("");
  const [isGoBtnClicked, setIsGoBtnClicked] = useState(false);
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

    // build regular expression to match any link from this domain
    let hostname = window.location.hostname.replaceAll(".", "\\.");
    let port = window.location.port;
    let regexObj = new RegExp(
      `^https?:\/\/(([^\/]*\.)|)${hostname}${port && `:`}${port}(|/.*)$`,
      "gm"
    );

    // Detect if the query is a valid URL with domains tinyurl.com and this website url
    if (
      query.match(/^(http(s)?:\/\/)?(www\.)?tinyurl\.com\/[a-zA-Z0-9]+$/) ||
      regexObj.test(query)
    )
      setQueryShareURL(query);
    else setQueryShareURL("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        {queryShareUrl && (
          <div
            className={
              isGoBtnClicked
                ? styles.notrixShareIndicatorShine
                : styles.notrixShareIndicator
            }
          >
            <span className={styles.brandingSymbol}>N</span>{" "}
            <span className={styles.shareText}>Share</span>
          </div>
        )}
        <input
          type="text"
          disabled={isGoBtnClicked}
          onChange={(e) => {
            filterSearchQuery(e.target.value);
          }}
          placeholder="search for notes..."
        />
        {queryShareUrl && (
          <button
            className={styles.notrixShareGoBtn}
            disabled={isGoBtnClicked}
            onClick={() => {
              setIsGoBtnClicked(true);
              window.location.href = queryShareUrl;
            }}
          >
            Go
            {isGoBtnClicked ? (
              <div class={styles.loaderWheel} />
            ) : (
              <FeatherIcon icon="arrow-right-circle" color="#ddd" size="15" />
            )}
          </button>
        )}
      </div>
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
