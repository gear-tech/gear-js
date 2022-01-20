FROM node:16-alpine

WORKDIR /app

COPY package*.json /app/
RUN ["npm", "install"]

COPY ./src /app/src/

CMD ["npm", "test"]
