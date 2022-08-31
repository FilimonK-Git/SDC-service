import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 100, // corresponds to RPS
  duration: '10s',
  thresholds: {
    http_req_duration: ["p(99)<2000"], // 99% of requests must complete below 2s
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
  },
};

export default function () {

  // console.log(`REQUEST PER SECOND: ${options.vus}`)

  let productId = 1;
  let question_id = 1
  let answer_id = 1

  let questionInfo = {
    product_id: 1,
    body: 'testQ',
    name: 'testN',
    email: 'testE',
  }
  let answerInfo = {
    body: 'testA',
    name: 'testN',
    email: 'testE',
    photos: ['testURL1', 'testURL2']
  }

  const BASE_URL = 'http://localhost:3000/';

  const responses = http.batch([
    // ['GET', `${BASE_URL}qa/questions?productId=${productId}`],
    ['POST', `${BASE_URL}qa/questions`, questionInfo],
    // ['POST', `${BASE_URL}qa/questions/${question_id}/answers`, answerInfo],
    // ['PUT', `${BASE_URL}qa/questions/${question_id}/helpful`],
    // ['PUT', `${BASE_URL}qa/answers/${answer_id}/helpful`],
    // ['PUT', `${BASE_URL}qa/answers/${answer_id}/report`]
  ]);

  // check(responses[0], {'should receive status 200 for findQnA() get request: (REQUEST PER SECOND = 1000)': (res) => res.status === 200});
  check(responses[0], {'should receive status 201 for addQuestion() post request: (REQUEST PER SECOND = 100)': (res) => res.status === 201});
  // check(responses[0], {'should receive status 201 for addAnswer() post request: (REQUEST PER SECOND = 10)': (res) => res.status === 201});
  // check(responses[0], {'should receive status 204 for helpfulQuestion() put request: (REQUEST PER SECOND = 1000)': (res) => res.status === 204});
  // check(responses[0], {'should receive status 204 for helpfulAnswer() put request: (REQUEST PER SECOND = 1000)': (res) => res.status === 204});
  // check(responses[0], {'should receive status 204 for reportAnswer() put request: (REQUEST PER SECOND = 1000)': (res) => res.status === 204});

  sleep(1);
}


  // stages: [
  // { duration: '10s', target: 1},
  // { duration: '10s', target: 10},
  // { duration: '10s', target: 100},
  // { duration: '10s', target: 1000},
  // { duration: '10s', target: 1}],
