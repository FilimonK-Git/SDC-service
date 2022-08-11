
drop database if exists SDC_QnA;
create database SDC_QnA;
use SDC_QnA;

drop table if exists questions;
create table questions (
  id int not null,
  primary key (id)
);

drop table if exists answers;
create table answers (
  id int not null,
  primary key (id)
);

