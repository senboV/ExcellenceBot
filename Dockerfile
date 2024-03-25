# syntax=docker/dockerfile:1

FROM node:latest
WORKDIR /ExcellenceBot
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5432
CMD ["node", "index.js"]