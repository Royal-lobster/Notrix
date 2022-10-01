import React from "react";
import Button from "../general_components/Button";
import styles from "./Migrate.module.css";
import FeatherIcon from "feather-icons-react";
import createUID from "create-unique-id";
import Localbase from "localbase";
import { toast, ToastContainer } from "react-toastify";

function Migrate({ history }) {
  let db = new Localbase();

  let exportData = async () => {
    // get all notes
    let notes = await db.collection("notes").get();

    // get note order
    let order = await db.collection("order").doc({ id: 0 }).get();

    // create a new blob with the data
    let blob = new Blob([JSON.stringify({ notes, order })], {
      type: "application/json",
    });

    // create a new url for the blob
    let url = URL.createObjectURL(blob);

    // create a new anchor element
    let a = document.createElement("a");

    // set the href of the anchor element to the url
    a.href = url;

    // set the download attribute of the anchor element to the file name
    a.download = "notes.json";

    // click the anchor element
    a.click();
  };

  let importData = async (e) => {
    // get the file from the input
    let file = e.currentTarget.files[0];

    // read the file as text
    let text = await file.text();

    try {
      // parse the text as json
      let data = JSON.parse(text);

      // get the notes and order from the json
      let { notes, order } = data;

      // change ids of notes to avoid conflicts and reflect the changes of ids in order
      notes.forEach((note) => {
        let newId = createUID(22);

        console.log(note.id, "--->", newId);
        order.order = order.order.map((id) => (id === note.id ? newId : id));
        note.id = newId;
      });

      // loop through the notes and add them to the database
      notes.forEach((note) => {
        db.collection("notes").add(note);
      });

      // modify the order in the database
      db.collection("order")
        .doc({ id: 0 })
        .get()
        .then((doc) => {
          db.collection("order")
            .doc({ id: 0 })
            .update({
              order: [...order.order, ...doc.order],
            });
        });

      toast.success("Success! Going Home", {
        autoClose: 3000,
        closeButton: false,
      });

      // redirect to home page
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      toast.error("Invalid File", {
        type: toast.TYPE.ERROR,
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer position="bottom-center" theme="dark" />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {/* Branding of Application, at the left most side of nav */}
          <h2 className={styles.branding} onClick={() => history.push("/")}>
            <div className={styles.brandingSymbol}>N</div>
            <div className={styles.brandingLettering}>Notrix Migrate</div>
          </h2>

          <div className={styles.content}>
            <div className={styles.section}>
              {/* Export Message */}
              <div className={styles.themeIcon}>
                <FeatherIcon icon="upload" size="20" />
              </div>
              <h1 className={styles.title}>Export Notes</h1>
              <p className={styles.message}>
                Click on the button below to export the data from your notion.
                This will export all your notes into JSON file.
              </p>

              {/* Export Button */}
              <div className={styles.buttonWrapper}>
                <Button
                  className={styles.exportButton}
                  text="Export Raw Data"
                  icon="file-text"
                  toggleColor="#1a73e8"
                  onClick={exportData}
                />
              </div>
            </div>
            <div className={styles.section}>
              {/* Import Message */}
              <div className={styles.themeIcon}>
                <FeatherIcon icon="download" size="20" />
              </div>
              <h1 className={styles.title}>Import Notes</h1>
              <p className={styles.message}>
                Upload the exported data from your notion. This will add the new
                imported notes to your existing notes.
              </p>
              <input
                type="file"
                id="file"
                name="import"
                accept=".json"
                onChange={importData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Migrate;
