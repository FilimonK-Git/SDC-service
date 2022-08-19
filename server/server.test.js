const app = require("./server.js");
const request = require("supertest");
const db = require("./../database/postgresDB.js");

describe("QnA microservice functionality", () => {
  afterAll(() => {
    return db.db.end();
  });

  it("should make get request to /qa/questions endpoint and fetch json data from postgres database", async () => {
    let testProductID = 1;
    let result = await request(app)
      .get("/qa/questions")
      .query({ productId: testProductID })
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("should find the first question posted for a product from database", async () => {
    let testProductID = 1;
    let result = await request(app)
      .get("/qa/questions")
      .query({ productId: testProductID });
    let firstQuestionAsked;

    for (let questionObj of result.body.results) {
      if (questionObj.question_id === 1) {
        firstQuestionAsked = questionObj.question_body;
      }
    }

    expect(firstQuestionAsked).toEqual("What fabric is the top made of?");
  });

  it("should find the first answer posted for a product from database", async () => {
    let testProductID = 1;
    let result = await request(app)
      .get("/qa/questions")
      .query({ productId: testProductID });

    let firstAnswerPosted;
    for (let questionObj of result.body.results) {
      if (questionObj.question_id === 1) {
        firstAnswerPosted = questionObj.answers["5"].body;
      }
    }

    expect(firstAnswerPosted).toEqual(
      "Something pretty soft but I can't be sure"
    );
  });

  it("should return a server-side error for non-existent product ID request", async () => {
    let testProductID = null;
    let result = await request(app)
      .get("/qa/questions")
      .query({ productId: testProductID })
      .expect(500);
  });

  it("should add a question into questions table", async () => {
    // should i remove test question after adding... thoughts?? since they are being added into db permanently

    let result = await request(app)
      .post("/qa/questions")
      .send({
        body: "testQuestion",
        name: "Fili",
        email: "fili@gmail.com",
        product_id: 1,
      })
      .expect(201);

    expect(JSON.parse(result.text).SuccessMsg).toEqual("Question posted!");
  });

  it("should return a server-side error when a question is not posted succesfully", async () => {
    let result = await request(app)
      .post("/qa/questions")
      .send({
        body: "testQuestion",
        name: "Fili",
        email: "fili@gmail.com",
        // product_id: 1, // removed product_id from parameter to force and test error
      })
      .expect(500);
  });

  it("should add an answer to a question into answers table", async () => {
    let testQuestionID = 1;
    let result = await request(app)
      .post(`/qa/questions/${testQuestionID}/answers`)
      .send({
        body: "testQuestion",
        name: "Fili",
        email: "fili@gmail.com",
        photos: [
          "https://res.cloudinary.com/lexicon-atelier/image/upload/v1660919022/tfys3nmuyagg9uvm1hfk.png",
          "https://res.cloudinary.com/lexicon-atelier/image/upload/v1660919027/qnnpjxal19m9rzjpqlob.png",
        ],
      })
      .expect(201);
    expect(JSON.parse(result.text).SuccessMsg).toEqual("Answer posted!");
  });

  it("should return a server-side error when answer is not posted succesfully", async () => {
    let testQuestionID = 1;
    let result = await request(app)
      .post(`/qa/questions/${testQuestionID}/answers`)
      .send({
        body: "testQuestion",
        name: "Fili",
        email: "fili@gmail.com", // missing photos property introduced to force ane test error
      })
      .expect(500);
  });

  it("should increment question helpfulness count by one when user clicks on 'helpful?' on question widget", async () => {
    let testQuestionID = 1;
    let result = await request(app)
      .put(`/qa/questions/${testQuestionID}/helpful`)
      .expect(204);
  });

  it("should increment answer helpfulness count by one when user clicks on 'helpful?' on a given answer", async () => {
    let testAnswerID = 1;
    let result = await request(app)
      .put(`/qa/answers/${testAnswerID}/helpful`)
      .expect(204);
  });

  it("should change the reported status of an answer", async () => {
    let testAnswerID = 1;
    let result = await request(app)
      .put(`/qa/answers/${testAnswerID}/report`)
      .expect(204);
  });
});
