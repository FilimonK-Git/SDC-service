
drop table if exists questions cascade;
CREATE TABLE questions (
   question_id SERIAL PRIMARY KEY,
   product_id INT,
   question_body VARCHAR (1000),
   question_date BIGINT,
   asker_name VARCHAR (60),
   asker_email VARCHAR (60),
   reported INT,
   question_helpfulness INT
);

\COPY questions(question_id,product_id,question_body,question_date,asker_name,asker_email,reported,question_helpfulness) FROM '/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/questions.csv' DELIMITER ',' CSV HEADER;
ALTER TABLE questions ALTER reported TYPE BOOLEAN USING CASE WHEN reported=1 THEN TRUE ELSE FALSE END;
CREATE INDEX questions_id_index ON questions (product_id);

drop table if exists answers cascade;
CREATE TABLE answers (
   id SERIAL PRIMARY KEY,
   question_id INT,
   body VARCHAR (1000),
   date BIGINT,
   answerer_name VARCHAR (60),
   answerer_email VARCHAR (60),
   reported INT,
   helpful INT,
   FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

\COPY answers(id,question_id,body,date,answerer_name,answerer_email,reported,helpful) FROM '/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/answers.csv' DELIMITER ',' CSV HEADER;
ALTER TABLE answers ALTER reported TYPE BOOLEAN USING CASE WHEN reported=1 THEN TRUE ELSE FALSE END;
CREATE INDEX answers_id_index ON answers (question_id);



drop table if exists answers_photos cascade;
CREATE TABLE answers_photos (
   id SERIAL PRIMARY KEY,
   answer_id INT,
   url VARCHAR (2083),
   FOREIGN KEY (answer_id) REFERENCES answers(id)
);

\COPY answers_photos(id,answer_id,url) FROM '/Users/filimonkiros/HackReactor/RPP36/Weeks_Aug1_Sep24/QnAData/answers_photos.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX answersPhotos_id_index ON answers_photos (answer_id);

