const { Client } = require("pg");
const Promise = require("bluebird");
const fs = require("fs");
require("dotenv").config();
const dbHost = process.env.ec2Host;
const dbUser = process.env.dbUser;
const dbpassword = process.env.ec2DB;
const dbName = process.env.dbName;

const db = new Client({
  host: `${dbHost}`,
  user: `${dbUser}`,
  port: 5432,
  password: `${dbpassword}`,
  database: `${dbName}`,
});

// db.connect();
db.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

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
  let nextQuestionIDquery = `SELECT nextval('qSeq')`;
  db.query(nextQuestionIDquery)
    .then((nextQuestionID) => {
      let addQuestionQuery = `
      Insert into questions (question_id, product_id, question_body,question_date,
        asker_name, asker_email,reported,question_helpfulness)
          VALUES (${nextQuestionID.rows[0].nextval}, ${questionInfo.product_id}, '${questionInfo.body}', '${timeQuestionAsked}', '${questionInfo.name}','${questionInfo.email}', false, 0)`;

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

  let nextAnswerIDquery = `SELECT nextval('aSeq')`;

  db.query(nextAnswerIDquery)

    .then((nextAnswerID) => {
      let addAnswerQuery = `
      Insert into answers (answer_id, question_id, body,date,
        answerer_name, answerer_email,reported,helpful)
          VALUES (${nextAnswerID.rows[0].nextval}, ${questionID}, '${answerInfo.body}',
          '${timeAnswerPosted}', '${answerInfo.name}','${answerInfo.email}', false, 0)`;

      db.query(addAnswerQuery)
        .then((answerInsertionResult) => {
          if (answerInfo.photos.length !== 0) {
            let promisesArrary = [];

            for (let i = 0; i < answerInfo.photos.length; i++) {
              promisesArrary.push(
                new Promise((resolve, reject) => {
                  let nextPhotoIDquery = `SELECT nextval('pSeq')`;

                  db.query(nextPhotoIDquery)

                    .then((nextPhotoID) => {
                      let addPhotoQuery = `Insert into answers_photos (id, answer_id, url) VALUES (${nextPhotoID.rows[0].nextval}, ${nextAnswerID.rows[0].nextval}, '${answerInfo.photos[i]}')`;

                      db.query(addPhotoQuery, (err, result) => {
                        if (err) {
                          console.log("REJJ", err.detail);
                          // reject(err);
                        } else {
                          resolve(result); // OR setval and resolve ??

                          // db.query(
                          //   `SELECT setval('pSeq', max(id)) FROM answers_photos;`
                          // )
                          //   .then((res) => {
                          //     // resolve(result);
                          //   })
                          //   .catch((err) => {
                          //     console.log("errSET PROMIzz", err);
                          //   });
                        }
                      });
                    })
                    .catch((err) => cb(err));
                })
              );
              // nextNewPhotoId++;
            }
            return promisesArrary;
          } else {
            cb(null, answerInsertionResult);
          }
        })
        .then((promisesArrary) => {
          Promise.all(promisesArrary).then((answerInsertionResult) => {
            cb(null, answerInsertionResult);
          });
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
