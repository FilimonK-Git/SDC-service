
drop table if exists questions;
CREATE TABLE questions (
   id SERIAL,
   product_id INT,
   body TEXT,
   date_written BIGINT,
   asker_name VARCHAR (60),
   asker_email VARCHAR (60),
   reported INT,
   helpful INT
);

drop table if exists answers;
CREATE TABLE answers (
   id SERIAL,
   question_id INT,
   body TEXT,
   date_written BIGINT,
   answerer_name VARCHAR (60),
   answerer_email VARCHAR (60),
   reported INT,
   helpful INT
);

drop table if exists answers_photos;
CREATE TABLE answers_photos (
   id SERIAL,
   answer_id INT,
   url TEXT
);

\COPY questions(id,product_id,body,date_written,asker_name,asker_email,reported,helpful) FROM '/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/questions.csv' DELIMITER ',' CSV HEADER;

\COPY answers(id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful) FROM '/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/answers.csv' DELIMITER ',' CSV HEADER;

\COPY answers_photos(id,answer_id,url) FROM '/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/answers_photos.csv' DELIMITER ',' CSV HEADER;


