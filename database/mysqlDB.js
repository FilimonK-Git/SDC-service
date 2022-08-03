const mysql = require("mysql2");

const sqlDB = mysql.createConnection({
  user: "root",
  password: "root",
  database: "SDC_QnA",
});

sqlDB.connect((err) => {
  err ? console.log("sqlDB connection error") : console.log("sqlDB connected!");
});

// ===============================================================
/*
Quick startup
- Go to System Preferences on Mac, find MySQL, start server
- Filimons-MacBook-Pro:SDC-service filimonkiros$ mysql -u root -p (enter password: root)
> show databases;
> create database SDC_QnA;
- To run schema: mysql -u root -p < database/mysql_schema.sql (enter password: root)
> use SDC_QnA;
> show tables;
*/
