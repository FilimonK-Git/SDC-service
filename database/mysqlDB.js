const mysql = require("mysql2");

const sqlDB = mysql.createConnection({
  user: "root",
  password: "root",
  database: "SDC_QnA",
});

sqlDB.connect((err) => {
  err ? console.log("sqlDB connection error") : console.log("sqlDB connected!");
});
