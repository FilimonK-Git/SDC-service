const { Client } = require("pg");
const Promise = require("bluebird");
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
  let findQnAquery = `Select
  questions.question_id, questions.question_body, questions.question_date, questions.asker_name, questions.question_helpfulness, questions.reported,
  answers.answer_id, answers.body, answers.date, answers.answerer_name, answers.reported, answers.helpful, answers_photos.url
    from questions
    left join answers on questions.question_id=answers.question_id
    left join answers_photos on answers.answer_id=answers_photos.answer_id
    where product_id=${productID}`;

  db.query(findQnAquery, (err, result) => {
    if (err) {
      cb(err);
    } else {
      for (let data of result.rows) {
        let answers = {};
        answers[data.answer_id] = {
          id: data.answer_id,
          body: data.body,
          date: data.date,
          answerer_name: data.answerer_name,
          helpfulness: data.helpful,
          photos: [data.url],
        };
        data.answers = answers;
        delete data.answer_id;
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
    }
  });
};

const addQuestion = (questionInfo, cb) => {
  let timeQuestionAsked = new Date().toISOString();

  let questionIDquery = `SELECT question_id	FROM questions order by question_id desc limit 1`;
  db.query(questionIDquery)
    .then((result) => {
      let previousQuestionId = result.rows[0].question_id;
      let nextNewQuestionId = previousQuestionId + 1;
      return nextNewQuestionId;
    })
    .then((nextNewQuestionId) => {
      let addQuestionQuery = `
      Insert into questions (question_id, product_id, question_body,question_date,
        asker_name, asker_email,reported,question_helpfulness)
          VALUES (${nextNewQuestionId}, ${questionInfo.product_id}, '${questionInfo.body}', '${timeQuestionAsked}', '${questionInfo.name}','${questionInfo.email}', false, 0)`;

      db.query(addQuestionQuery)
        .then((result) => {
          cb(null, result);
        })
        .catch((err) => {
          cb(err);
        });
    })
    .catch((err) => cb(err));
};

const addAnswer = (answerInfo, questionID, cb) => {
  let timeAnswerPosted = new Date().toISOString();

  let answerIDquery = `SELECT answer_id	FROM answers order by answer_id desc limit 1`;
  db.query(answerIDquery)
    .then((dbAnswerIDresult) => {
      let previousAnswerId = dbAnswerIDresult.rows[0].answer_id;
      let nextNewAnswerId = previousAnswerId + 1;
      return nextNewAnswerId;
    })
    .then((nextNewAnswerId) => {
      let addAnswerQuery = `
      Insert into answers (answer_id, question_id, body,date,
        answerer_name, answerer_email,reported,helpful)
          VALUES (${nextNewAnswerId}, ${questionID}, '${answerInfo.body}',
          '${timeAnswerPosted}', '${answerInfo.name}','${answerInfo.email}', false, 0)`;

      db.query(addAnswerQuery)
        .then((answerInsertionResult) => {
          if (answerInfo.photos.length !== 0) {
            let photoIDquery = `SELECT id	FROM answers_photos order by id desc limit 1`;
            db.query(photoIDquery)
              .then((dbPhotoIDresult) => {
                let previousPhotoId = dbPhotoIDresult.rows[0].id;
                let nextNewPhotoId = previousPhotoId + 1;
                return nextNewPhotoId;
              })
              .then((nextNewPhotoId) => {
                let promisesArrary = [];

                for (let i = 0; i < answerInfo.photos.length; i++) {
                  promisesArrary.push(
                    new Promise((resolve, reject) => {
                      let addPhotoQuery = `Insert into answers_photos (id, answer_id, url) VALUES (${nextNewPhotoId}, ${nextNewAnswerId}, '${answerInfo.photos[i]}')`;
                      db.query(addPhotoQuery, (err, result) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve(result);
                        }
                      });
                    })
                  );
                  nextNewPhotoId++;
                }
                Promise.all(promisesArrary).then((values) => {
                  cb(null, answerInsertionResult);
                });
              })
              .catch((err) => cb(err));
          } else {
            cb(null, answerInsertionResult);
          }
        })
        .catch((err) => {
          cb(err);
        });
    })
    .catch((err) => cb(err));
};

const helpfulQuestion = (questionID, cb) => {
  let updateQhelpQuery = `Update questions Set question_helpfulness=question_helpfulness+1 where question_id=${questionID}`;

  db.query(updateQhelpQuery)
    .then((result) => {
      cb(null, result);
    })
    .catch((err) => {
      cb(err);
    });
};

const helpfulAnswer = (answerID, cb) => {
  let updateAhelpQuery = `Update answers Set helpful=helpful+1 where answer_id=${answerID}`;

  db.query(updateAhelpQuery)
    .then((result) => {
      cb(null, result);
    })
    .catch((err) => {
      cb(err);
    });
};

const reportAnswer = (answerID, cb) => {
  let updateAreportQuery = `Update answers Set reported=true where answer_id=${answerID}`;

  db.query(updateAreportQuery)
    .then((result) => {
      cb(null, result);
    })
    .catch((err) => {
      cb(err);
    });
};

module.exports.db = db;
module.exports.findQnA = findQnA;
module.exports.addQuestion = addQuestion;
module.exports.addAnswer = addAnswer;
module.exports.helpfulQuestion = helpfulQuestion;
module.exports.helpfulAnswer = helpfulAnswer;
module.exports.reportAnswer = reportAnswer;
