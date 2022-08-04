const { Client } = require("pg");

const db = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "SDC_QnA",
});

db.connect();

db.query("select * from questions", (err, res) => {
  if (err) console.log("ERRRR", err);
  else console.log("RESSS,", res);
  db.end;
});

// ===============================================================
/*
Insatallation and startup
- installed using installer from https://www.postgresql.org/download/macosx/
- set path in main Library (Go->Computer->macintosh->library->)
Filimons-MacBook-Pro:database filimonkiros$ export PATH=/Library/PostgreSQL/14/bin:$PATH

- manually created SDC_QnA database in pgAdmin 4 GUI
- installed 'pg' package in SDC repo: see guide: https://node-postgres.com/features/connecting

- open postgres (from within SDC-service/database folder) and execute schema
Filimons-MacBook-Pro:database filimonkiros$ psql --host=localhost --dbname=SDC_QnA --username=postgres
Password for user postgres: root
psql (14.4)
Type "help" for help.

SDC_QnA=# \i postgres_schema.sql

-to see tables:
SDC_QnA=# \dt

-to quit:
SDC_QnA=# \q

- to run db js:
- Filimons-MacBook-Pro:SDC-service filimonkiros$ node database/postgresDB.js
*/
