const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/SDC_QnA");

const productsSchema = new mongoose.Schema({
  product_id: Number, // unique ObjectID
  name: String,
  category: String,
});

const questionSchema = new mongoose.Schema({
  product_id: Number, // references products document unique ObjectID (via $lookup)
  question_id: Number, // unique ObjectID
  question_body: String,
  question_date: String,
  asker_name: String,
  question_helpfulness: Number,
  reported: Boolean,
});

const answerSchema = new mongoose.Schema({
  question_id: Number, // reference to questions document unique ObjectID (via $lookup)
  answer_id: Number,
  body: String,
  date: String,
  answerer_name: String,
  helpfulness: Number,
  photos: [
    {
      // embeded schema
      id: Number,
      url: String,
    },
  ],
});

const products = mongoose.model("answers", productsSchema);
const questions = mongoose.model("questions", questionSchema);
const answers = mongoose.model("answers", answerSchema);

// const photosSchema = new mongoose.Schema({
//   answer_id: Number, // reference to answers document
//   id: Number,
//   url: String,
// });

// const photos = mongoose.model("answers", photosSchema);
