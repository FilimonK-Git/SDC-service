const { Client } = require("pg");
const fs = require("fs");
require("dotenv").config();
const dbpassword = process.env.dbPass;
const dbName = process.env.dbName;

const db = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: `${dbpassword}`,
  database: `${dbName}`,
});

db.connect();

const findQnA = (productID, cb) => {
  let query = `Select
  questions.question_id, questions.question_body, questions.question_date, questions.asker_name, questions.question_helpfulness, questions.reported,
  answers.id, answers.body, answers.date, answers.answerer_name, answers.reported, answers.helpful,
  answers_photos.url
    from questions
    left join answers on questions.question_id=answers.question_id
    left join answers_photos on answers.id=answers_photos.answer_id
    where product_id=${productID}`;

  db.query(query, (err, result) => {
    if (err) {
      cb(err);
    } else {
      for (let data of result.rows) {
        let answers = {};
        answers[data.id] = {
          id: data.id,
          body: data.body,
          date: data.date,
          answerer_name: data.answerer_name,
          helpfulness: data.helpful,
          photos: [data.url],
        };
        data.answers = answers;
        delete data.id;
        delete data.body;
        delete data.date;
        delete data.answerer_name;
        delete data.helpful;
        delete data.url;
      }
      var uniqueProductIDs = [];
      var QnAData = [];
      for (let i = 0; i < result.rows.length; i++) {
        let data = result.rows[i];
        if (!uniqueProductIDs.includes(data.question_id)) {
          QnAData.push(data);
          uniqueProductIDs.push(data.question_id);
          delete result.rows[i];
        }
      }
      var dbData = result.rows.flat();
      for (let i = 0; i < QnAData.length; i++) {
        let currQnAObj = QnAData[i];
        for (let j = 0; j < dbData.length; j++) {
          var nextQnAObj = dbData[j];
          if (currQnAObj.question_id === nextQnAObj.question_id) {
            var currkey = Object.keys(currQnAObj.answers);
            var nextkey = Object.keys(nextQnAObj.answers);
            if (currkey[0] === nextkey[0]) {
              var mergedPhotos = currQnAObj.answers[currkey].photos.concat(
                nextQnAObj.answers[nextkey].photos
              );
              currQnAObj.answers[currkey].photos = mergedPhotos;
            } else {
              currQnAObj.answers[nextkey[0]] = nextQnAObj.answers[nextkey[0]];
            }
          }
        }
      }
      cb(null, QnAData);
      // db.end();
    }
  });
};

const addQuestion = (questionInfo, cb) => {
  /* questionInfo = {
      body: 'mmm',
      name: 'fff111',
      email: 'fff@gmail.com',
      product_id: 71697
  }*/

  questionInfo = questionInfo.questionInfo;

  let timeOfClick = new Date().toLocaleString("en-US", {
    hour12: false,
  });

  let previousQuestionId;
  let questionIDquery = `Select Last(question_id) from questions`;
  db.query(questionIDquery)
    .then((result) => {
      // console.log("mmm", result);
      previousQuestionId = result.rows[0].max;

      let nextNewId = previousQuestionId + 1;
      return nextNewId;
    })
    .then((nextNewId) => {
      // console.log("bbb", result);
      let query = `
      Insert into questions (question_id, product_id,
        question_body,question_date,
        asker_name, asker_email,
        reported,question_helpfulness)
          VALUES (${nextNewId}, ${questionInfo.product_id}, '${
        questionInfo.body
      }', '${123456789}', '${questionInfo.name}',
                  '${questionInfo.email}', false, 0);`;

      db.query(query)
        .then((result) => {
          console.log("Posted");
        })
        .catch((err) => {
          console.log("Error posting", err);
          cb(err);
        });
      // .then(() => db.end());
    })
    // .then(() => db.end())
    .catch((err) => console.log("Err fecthing highest question Id: ", err));
};
// addQuestion();

const addAnswer = (answerInfo, questionID) => {
  /* answerInfo = {
      body: '',
      name: '',
      email: '',
      photos: []
  }*/
  // create db.query with insert into answers table
};

const helpfulQuestion = (questionID) => {
  // create db.query ... increment helpful-question int ??
};

const helpfulAnswer = (answerID) => {
  // create db.query ... increment helpful-answer int ??
};

const reportQuestion = (questionID) => {
  // create db.query ... change report bool
};

const reportAnswer = (answerID) => {
  // create db.query ... change report bool
};

module.exports.db = db;
module.exports.findQnA = findQnA;
module.exports.addQuestion = addQuestion;
module.exports.addAnswer = addAnswer;
module.exports.helpfulQuestion = helpfulQuestion;
module.exports.helpfulAnswer = helpfulAnswer;
