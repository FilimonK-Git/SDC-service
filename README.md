# System Design: Question and Answers API

> Microservice for front-end e-commerce webiste: https://github.com/rpp36-fec-lexicon/FEC

> Inherited legacy backend system horizontally scaled to handle substantial web traffic load (~3500 RPS)

## Tech Stack

![Node](https://img.shields.io/badge/-Node-9ACD32?logo=node.js&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/-Express-DCDCDC?logo=express&logoColor=black&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-0064a5?logo=postgresql&logoColor=white&style=for-the-badge)
![NGINX](https://img.shields.io/badge/-NGINX-009900?logo=nginx&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![AWS](https://img.shields.io/badge/-AWS-232F3E?logo=amazonaws&logoColor=white&style=for-the-badge)
![Jest](https://img.shields.io/badge/-Jest-C21325?logo=jest&logoColor=white&style=for-the-badge)
![k6](https://img.shields.io/badge/-k6.io-4c00b0?logo=loader.io&logoColor=White&style=for-the-badge)
![loader.io](https://img.shields.io/badge/-loader.io-6495ED?logo=loader.io&logoColor=white&style=for-the-badge)

## Presentation slides

> https://docs.google.com/presentation/d/1jPnZ500CcZSJOC7SddDmnFkz_yu9IAKb_QGPx7FvieM/edit?usp=sharing

## Engineering Journal

> https://ionized-stretch-ff3.notion.site/690b828c3d6642148328f56ed3962fa5?v=34b0dff68a7b4916adaba1bcda7129c0


## Database schema
<img src="https://user-images.githubusercontent.com/81248975/199600733-901bd9da-26ce-4033-8620-e91acd3d1aca.png"  width="550" height="400" />

## Scaling Summary
  > 6 API endpoints interacted with 3 tables hosted in PostgreSQL DB to deliver 

  ### Benchmark results
  
  > System level agreement (100 RPS at <1% error) were met through one AWS server deployment

  <img src="https://user-images.githubusercontent.com/81248975/201204397-ea9358ab-3436-4d1b-b2cf-9f1f71fb19a6.png"  width="750" height="250" />
  
  <img src="https://user-images.githubusercontent.com/81248975/201202175-f32b792d-2a98-42bc-8b38-7912d029d14e.png"  width="750" height="500" />

  ### Horizontally scaled results 
   > Four servers deployed behind NGINX round-robin load balancer

   > SLA RPS exceed by average 25 times 
   
   > Please see [presentation slides](https://docs.google.com/presentation/d/1jPnZ500CcZSJOC7SddDmnFkz_yu9IAKb_QGPx7FvieM/edit?usp=sharing) for incremental scaling progress

  <img src="https://user-images.githubusercontent.com/81248975/201204907-5730f826-2fc7-420e-bffa-dc5a741c8792.png"  width="650" height="250" />

 <img src="https://user-images.githubusercontent.com/81248975/201205354-b0d8f2d8-1704-42f1-b5a6-e85a5f00c020.png"  width="750" height="500" />
  

  
  
  
  


