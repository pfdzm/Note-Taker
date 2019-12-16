const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs").promises;

const PORT = process.env.PORT || 8080;

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
  console.log("req body, ", req.body);
  const dbArr = JSON.parse(await fs.readFile(path.join(__dirname, "/db/db.json"), "utf-8"));
  dbArr.push(req.body);
  await fs.writeFile(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(dbArr)
  );
  res.sendStatus(200);
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
});

app.listen(PORT, err => {
  if (err) throw err;
  console.log("app listening on port ", PORT);
});
