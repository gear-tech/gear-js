FROM node:16-alpine

WORKDIR /app

COPY package*.json /app/
RUN ["npm", "install"]

COPY ./tsconfig.json ./babel.config.json /app/
COPY ./src /app/src/

CMD ["npm", "test"]
