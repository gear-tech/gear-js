FROM node:16-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY ./website/interfaces website/interfaces
COPY ./website/events-listener website/events-listener
RUN yarn install
RUN yarn build:events-listener
CMD ["node", "website/events-listener/dist/main"]
