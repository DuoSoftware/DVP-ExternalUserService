FROM node:10-alpine
WORKDIR /usr/local/src/externaluserservice
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9002
CMD [ "node", "app.js" ]
