FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .


COPY idea/indexer-db ./idea/indexer-db
COPY idea/explorer ./idea/explorer
COPY idea/common ./idea/common

RUN yarn install

RUN yarn build:common
RUN yarn build:indexer-db
RUN yarn build:explorer

CMD ["node", "idea/explorer/dist/main.js"]
