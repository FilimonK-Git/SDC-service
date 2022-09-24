import http from "k6/http";
import { sleep, check } from "k6";

export const options = { // add ramp up to avoid excess missing reqs (see stages below)
  vus: 1000, // corresponds to RPS
  duration: '1m',
  thresholds: {
    http_req_duration: ["avg<2000"], // 95% of requests must complete below 2s, or ave
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
  },
};

export default function () {

  let productId = 1000008;
  let question_id = 3518960;
  let answer_id = 6879298;

  let questionInfo = {
    product_id: 1000008,
    body: 'testQ',
    name: 'testN',
    email: 'testE',
  }
  let answerInfo = {
    body: 'testA',
    name: 'testN',
    email: 'testE',
    photos: ['testURL1', 'testURL2', 'testURL3']
  }

  // {
  //   "body": "testA",
  //   "name": "testN",
  //   "email": "testE",
  //   "photos": ["testURL1", "testURL2", "testURL3"]
  // }

  // const BASE_URL = 'http://localhost:3000/'; // chnage to ec2 instance dns for cloud testing
  const BASE_URL = 'http://3.91.33.73/';


  const responses = http.batch([
    ['GET', `${BASE_URL}qa/questions?productId=${productId}`],
    // ['POST', `${BASE_URL}qa/questions`, questionInfo],
    // ['POST', `${BASE_URL}qa/questions/${question_id}/answers`, answerInfo],
    // ['PUT', `${BASE_URL}qa/questions/${question_id}/helpful`],
    // ['PUT', `${BASE_URL}qa/answers/${answer_id}/helpful`],
    // ['PUT', `${BASE_URL}qa/answers/${answer_id}/report`]
  ]);

  check(responses[0], {'should receive status 200 for findQnA() get request': (res) => res.status === 200});
  // check(responses[0], {'should receive status 201 for addQuestion() post request': (res) => res.status === 201});
  // check(responses[0], {'should receive status 201 for addAnswer() post request': (res) => res.status === 201});
  // check(responses[0], {'should receive status 204 for helpfulQuestion() put request': (res) => res.status === 204});
  // check(responses[0], {'should receive status 204 for helpfulAnswer() put request': (res) => res.status === 204});
  // check(responses[0], {'should receive status 204 for reportAnswer() put request': (res) => res.status === 204});

  sleep(1);
}



  // stages: [
  // { duration: '10s', target: 1},
  // { duration: '10s', target: 10},
  // { duration: '10s', target: 100},
  // { duration: '10s', target: 1000},
  // { duration: '10s', target: 1}],