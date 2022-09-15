From node:16

WORKDIR /SDC-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "server/server.js" ]





