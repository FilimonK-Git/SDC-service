const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/SDC_QnA");

const questionSchema = new mongoose.Schema({
  productID: String,
});

const answerSchema = new mongoose.Schema({
  productID: String,
});

const questions = mongoose.model("questions", questionSchema);
const answers = mongoose.model("answers", answerSchema);

// ===============================================================
/*
- Quick startup
Filimons-MacBook-Pro:~ filimonkiros$ mongo
>show dbs
>use SDC_QnA
>show collections/show tables/db.getCollectionNames()
>db.answers.find()



console.log("mongo state: ", mongoose.connection.readyState); // 2
ready states:
0: disconnected
1: connected
2: connecting
3: disconnecting

*/
