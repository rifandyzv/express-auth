FROM node:lts-slim

WORKDIR /express-app

COPY . /express-app/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

