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

    let firstQuestionAsked = result.body.results[0].question_body;
    expect(firstQuestionAsked).toEqual("What fabric is the top made of?");
  });

  it("should find the first answer posted for a product from database", async () => {
    let testProductID = 1;
    let result = await request(app)
      .get("/qa/questions")
      .query({ productId: testProductID });

    let firstAnswerPosted = result.body.results[0].answers["5"].body;
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

  // it("should ADD ... ", async () => {
  //   let questionInfo = {
  //     body: "testQuestion",
  //     name: "Fili",
  //     email: "fili@gmail.com",
  //     product_id: 1,
  //   };

  //   let result = await request(app)
  //     .post("/qa/questions")
  //     .send({ questionInfo })
  //     .expect(201);
  // });
});
