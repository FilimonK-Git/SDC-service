const app = require("./server.js");
const req = require("supertest");

describe("Test infrastrcture setup", () => {
  it("should respond with test get request ", async () => {
    var res = await req(app).get("/qna");
    expect(res.body).toEqual({ getQnA: "QnA get req test log" });
  });

  it("should respond with test post request ", async () => {
    var res = await req(app).post("/qna");
    expect(res.body).toEqual({ postQnA: "QnA post req test log" });
  });
});
