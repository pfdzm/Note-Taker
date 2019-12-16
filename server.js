const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs").promises;

const PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  // const notes = await fs.readFile('./db/db.json', "utf-8");
  // res.send(JSON.parse(notes))
  res.sendFile(path.join(__dirname, "/db/db.json"), err => {
    if (err) {
      console.error("Could not read database file, ", err);
    }
  });
});

app.listen(PORT, err => {
  if (err) throw err;
  console.log("app listening on port ", PORT);
});
