const express = require("express");
const app = express();
const port = 3000;

app.get("/qna", (req, res) => {
  res.json({ getQnA: "QnA get req test log" });
});

app.post("/qna", (req, res) => {
  res.json({ postQnA: "QnA post req test log" });
});

// ==========
const fs = require("fs");
// const stream = fs.createReadStream(
//   "/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/answers.csv",
//   { start: 0, end: 500 }
// );
// stream.on("data", (chunk) => console.log(chunk.toString()));

//========
// const CHUNK_SIZE = 10000000; // 10MB
// async function start() {
//   const stream = fs.createReadStream(
//     "/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/answers_photos.csv",
//     { highWaterMark: CHUNK_SIZE }
//   );
//   for await (const data of stream) {
//     console.log("DATA::", data.toString());
//     console.log("=============================");
//   }
// }
// start();

// app.listen(port, (req, res) => {
//   console.log(`Port ${port}: Listening ... `);
// });

module.exports = app;
