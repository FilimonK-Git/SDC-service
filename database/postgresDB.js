const { Client } = require("pg");
const fs = require("fs");

const db = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "SDC_QnA",
});

db.connect();

/* ======= TO READ DATA BY CHUNK ============
const CHUNK_SIZE = 10000000; // 10000000=10MB
async function dataReader() {
  const stream = fs.createReadStream(
    "/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/answers_photos.csv",
    { highWaterMark: CHUNK_SIZE }
    // { start: 17, end: 256 }
  );
  for await (const data of stream) {
    console.log(" ===== DATA ==== ", data.toString().split(/[\n,]+/));
  }
}
dataReader();
===========================================*/
