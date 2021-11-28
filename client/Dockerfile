FROM node:14.18-alpine3.14

WORKDIR /usr/client/

COPY ./ ./

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
