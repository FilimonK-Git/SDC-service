const express = require("express");
const app = express();
const port = 3000;
const db = require("./../database/postgresDB.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  // console.log("hittt", req.body);
  db.addQuestion(req.body, (err) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(200).send({ SuccessMsg: "Question posted!" });
    }
  });
});

// post an answer
app.post("/qa/questions/:question_id/answers", (req, res) => {
  db.addAnswer(req.body, req.params.question_id, (err) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(201).send({ SuccessMsg: "Answer posted!" });
    }
  });
});

// mark a question helpful
app.put("/qa/questions/:question_id/helpful", (req, res) => {
  db.helpfulQuestion(req.params.question_id, (err) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(204).send({ SuccessMsg: "Question marked helpful!" });
    }
  });
});

// mark an answer helpful
app.put("/qa/answers/:answer_id/helpful", (req, res) => {
  db.helpfulAnswer(req.params.answer_id, (err) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(204).send({ SuccessMsg: "Answer marked helpful!" });
    }
  });
});

// report a question
app.put("/qa/questions/:question_id/report", (req, res) => {
  db.reportQuestion(req.params.question_id, (err) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(204).send({ SuccessMsg: "Question reported!" });
    }
  });
});

// report an answer
app.put("/qa/answers/:answer_id/report", (req, res) => {
  db.reportAnswer(req.params.answer_id, (err) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(204).send({ SuccessMsg: "Answer reported!" });
    }
  });
});

/* FOR JEST INITIAL TEST
app.post("/qna", (req, res) => {
  res.json({ postQnA: "QnA post req test log" });
});
*/

// app.listen(port, (req, res) => {
//   console.log(`Port ${port}: Listening ... `);
// });

module.exports = app;
