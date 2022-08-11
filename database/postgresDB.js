const { Client } = require("pg");
const fs = require("fs");
require("dotenv").config();
const dbpassword = process.env.dbPass;
const dbName = process.env.dbName;

const db = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: `${dbpassword}`,
  database: `${dbName}`,
});

db.connect();

// query db for specific product id
var productID = 10;
var query = `Select * from questions where product_id=${productID}`;
const searchDB = (cb) => {
  db.query(query, (err, res) => {
    if (err) {
      cb(err);
    } else {
      cb(null, res);
    }
  });
};

module.exports.searchDB = searchDB;
