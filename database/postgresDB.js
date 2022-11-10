const { Pool } = require("pg");
const Promise = require("bluebird");
const fs = require("fs");
require("dotenv").config();
const dbHost = process.env.ec2Host;
const dbUser = process.env.dbUser;
const dbpassword = process.env.ec2DB;
const dbName = process.env.dbName;

const db = new Pool({
  host: `${dbHost}`,
  user: `${dbUser}`,
  port: 5432,
  password: `${dbpassword}`,
  database: `${dbName}`,
});

const findQnA = (productID, cb) => {
  let findQnAquery = `SELECT questions.question_id, questions.question_body, questions.question_date, questions.asker_name, questions.question_helpfulness, questions.reported,
      (SELECT COALESCE(json_agg (eachAnswer), '{}') FROM ( SELECT answers.question_id AS id, answers.body,
      answers.date, answers.answerer_name, answers.helpful, answers.reported,
      (SELECT COALESCE(json_agg(eachPhoto), '[]') FROM ( SELECT answers_photos.id, answers_photos.url
      FROM answers_photos WHERE answers_photos.answer_id = answers.answer_id) eachPhoto) AS photos
      FROM answers WHERE answers.question_id = questions.question_id) eachAnswer) AS answers FROM questions
      WHERE product_id = ${productID};`;

  db.query(findQnAquery, (err, result) => {
    if (err) {
      cb(err);
    } else {
      cb(null, result.rows);
    }
  });
};

const addQuestion = (questionInfo, cb) => {
  let timeQuestionAsked = new Date().toISOString();
  let addQuestionQuery = `
      Insert into questions (question_id,product_id, question_body,question_date,
        asker_name, asker_email,reported,question_helpfulness)
          VALUES ((SELECT nextval('qSeq')), ${questionInfo.product_id},
            '${questionInfo.body}', '${timeQuestionAsked}', '${questionInfo.name}',
            '${questionInfo.email}', false, 0)`;

  db.query(addQuestionQuery)
    .then((result) => {
      cb(null, result);
    })
    .catch((err) => {
      cb(err);
    });
};

const addAnswer = (answerInfo, questionID, cb) => {
  let timeAnswerPosted = new Date().toISOString();
  let addAnswerQuery = `
  Insert into answers (answer_id, question_id, body,date,
    answerer_name, answerer_email,reported,helpful)
      VALUES ((SELECT nextval('aSeq')), ${questionID}, '${answerInfo.body}',
      '${timeAnswerPosted}', '${answerInfo.name}','${answerInfo.email}', false, 0)
      RETURNING answer_id;`;

  db.query(addAnswerQuery)
    .then((result) => {
      cb(null, result);
    })
    .catch((err) => {
      cb(err);
    });
};

const addPhoto = (answer_id, url) => {
  return new Promise((resolve, reject) => {
    let addPhotoQuery = `Insert into answers_photos (id, answer_id, url) VALUES ((SELECT nextval('pSeq')), ${answer_id}, '${url}')`;
    db.query(addPhotoQuery)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
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
module.exports.addPhoto = addPhoto;
module.exports.helpfulQuestion = helpfulQuestion;
module.exports.helpfulAnswer = helpfulAnswer;
module.exports.reportAnswer = reportAnswer;
