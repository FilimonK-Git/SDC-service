const express = require("express");
const app = express();
const port = 3000;
const db = require("./../database/postgresDB.js");

app.get("/qna", (req, res) => {
  db.searchDB((err, result) => {
    if (err) {
      console.log("Error fetching data from db: ", err);
      res.end();
    } else {
      console.log("Success in fecthing data from db: ", result.rows);
      res.end();
    }
  });
});
// res.json({ getQnA: "QnA get req test log" });

app.post("/qna", (req, res) => {
  res.json({ postQnA: "QnA post req test log" });
});

app.listen(port, (req, res) => {
  console.log(`Port ${port}: Listening ... `);
});

// module.exports = app;
