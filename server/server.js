const express = require("express");
const app = express();
const port = 3000;
const db = require("./../database/postgresDB.js");
require("newrelic");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get questions and associated answers
app.get("/loaderio-e22d0e626e9b9fb69ff8d0c6170671db.txt", (req, res) => {
  res.send("loaderio-e22d0e626e9b9fb69ff8d0c6170671db");
  // res.end();
});

// Get questions and associated answers
app.get("/qa/questions", (req, res) => {
  db.findQnA(req.query.productId, (err, result) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(200).json({ results: result });
    }
  });
});

// post a questions
app.post("/qa/questions", (req, res) => {
  db.addQuestion(req.body, (err, result) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(201).json({ SuccessMsg: "Question posted!" });
    }
  });
});

// post an answer
app.post("/qa/questions/:question_id/answers", (req, res) => {
  db.addAnswer(req.body, req.params.question_id, (err, result) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(201).send({ SuccessMsg: "Answer posted!" });
    }
  });
});

// mark a question helpful
app.put("/qa/questions/:question_id/helpful", (req, res) => {
  db.helpfulQuestion(req.params.question_id, (err, result) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(204).end();
    }
  });
});

// mark an answer helpful
app.put("/qa/answers/:answer_id/helpful", (req, res) => {
  db.helpfulAnswer(req.params.answer_id, (err, result) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(204).end();
    }
  });
});

// report an answer
app.put("/qa/answers/:answer_id/report", (req, res) => {
  db.reportAnswer(req.params.answer_id, (err, result) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(204).end();
    }
  });
});

app.listen(port, (req, res) => {
  console.log(`Port ${port}: Listening ... `);
});

module.exports = app;
