const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs").promises;
const PORT = process.env.PORT || 8080;

// Express middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"), err => {
    if (err) {
      console.log("Could not load index html, ", err);
    }
  });
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"), err => {
    if (err) {
      console.log("Could not load note html, ", err);
    }
  });
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"), err => {
    if (err) {
      console.error("Could not read database file, ", err);
    }
  });
});

app.post("/api/notes", async (req, res) => {
  try {
    const db = JSON.parse(
      await fs.readFile(path.join(__dirname, "/db/db.json"), "utf-8")
    );
    // if 'db' doesnt have IDs we create them, since we need them for deleting notes
    const dbWithIds = db.map((val, index) => {
      if (!val.id) {
        return { title: val.title, text: val.text, id: index };
      } else {
        return val;
      }
    });

    // Add the new note
    dbWithIds.push({
      title: req.body.title,
      text: req.body.text,
      id: dbWithIds.length
    });

    // commit the changes to the db.json file
    await fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(dbWithIds)
    );
    // let the client know the request was succesful
    res.sendStatus(200);
  } catch (error) {
    console.error("Error while posting note, ", error);
    res.sendStatus(500);
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    // we get the ID from the URL
    const { id } = req.params;
    // we load the DB
    const db = JSON.parse(
      await fs.readFile(path.join(__dirname, "/db/db.json"), "utf-8")
    );
    // we filter our DB array to filter out any notes with the requested ID
    const dbFiltered = db.filter(note => note.id != id);
    // we commit the changes to the db.json file
    await fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(dbFiltered)
    );
    // we let the client know the request was succesful
    res.sendStatus(200);
  } catch (error) {
    console.error("Error while deleting note, ", error);
  }
});

app.listen(PORT, err => {
  if (err) throw err;
  console.log("app listening on port ", PORT);
});
