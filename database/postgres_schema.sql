
drop table if exists questions cascade;
CREATE TABLE questions (
   id SERIAL PRIMARY KEY,
   product_id INT,
   body VARCHAR (1000),
   date_written BIGINT,
   asker_name VARCHAR (60),
   asker_email VARCHAR (60),
   reported INT,
   helpful INT
);

drop table if exists answers cascade;
CREATE TABLE answers (
   id SERIAL PRIMARY KEY,
   question_id INT,
   body VARCHAR (1000),
   date_written BIGINT,
   answerer_name VARCHAR (60),
   answerer_email VARCHAR (60),
   reported INT,
   helpful INT,
   FOREIGN KEY (question_id) REFERENCES questions(id)
);

drop table if exists answers_photos cascade;
CREATE TABLE answers_photos (
   id SERIAL PRIMARY KEY,
   answer_id INT,
   url VARCHAR (2083),
   FOREIGN KEY (answer_id) REFERENCES answers(id)
);

\COPY questions(id,product_id,body,date_written,asker_name,asker_email,reported,helpful) FROM '/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/questions.csv' DELIMITER ',' CSV HEADER;

\COPY answers(id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful) FROM '/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/answers.csv' DELIMITER ',' CSV HEADER;

\COPY answers_photos(id,answer_id,url) FROM '/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/answers_photos.csv' DELIMITER ',' CSV HEADER;

CREATE INDEX questions_id_index ON questions (product_id);
CREATE INDEX answers_id_index ON answers (question_id);
CREATE INDEX answersPhotos_id_index ON answers_photos (answer_id);


-- reseach indexing