const express = require("express");
const app = express();
const port = 3000;

app.get("/qna", (req, res) => {
  res.json({ getQnA: "QnA get req test log" });
});

app.post("/qna", (req, res) => {
  res.json({ postQnA: "QnA post req test log" });
});

// app.listen(port, (req, res) => {
//   console.log(`Port ${port}: Listening ... `);
// });

module.exports = app;
