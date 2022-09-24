require("newrelic");
const express = require("express");
const Promise = require("bluebird");
const app = express();
const port = 3000;
const db = require("./../database/postgresDB.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get questions and associated answers
app.get("/loaderio-405daf996c3d2d8222d9271cf9e15ac8.txt", (req, res) => {
  res.send("loaderio-405daf996c3d2d8222d9271cf9e15ac8");
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
      // console.log("ERR!!", err);
      res.status(500).send(err).end();
    } else {
      // console.log("posted!!");
      res.status(201).json({ SuccessMsg: "Question posted!" });
    }
  });
});

// post an answer
app.post("/qa/questions/:question_id/answers", (req, res) => {
  let photos = req.body.photos;
  // let questionId = Number(req.params.question_id);

  db.addAnswer(req.body, req.params.question_id, (err, result) => {
    if (err) {
      // console.log("ERR!!", err);
      res.status(500).send(err).end();
    } else {
      // console.log("here", result);

      let answerId = result.rows[0].answer_id;

      // console.log("here", req.body, answerId);
      if (photos.length) {
        let promises = photos.map((url) => db.addPhoto(answerId, url));
        Promise.all(promises)
          .then((data) => {
            res.status(201).send("Answer and photo posted!");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        // console.log("here xx");
        res.status(201).send({ SuccessMsg: "Answer posted!" });
      }
    }
  });

  /*
  db.addAnswer(req.body, req.params.question_id, (err, result) => {
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(201).send({ SuccessMsg: "Answer posted!" });
    }
  });
  */
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
  // console.log(`Port ${port}: Listening ... `);
});

module.exports = app;
