# syntax=docker/dockerfile:1
FROM node:16.6.1-alpine3.11

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD ["node", "app.js"]