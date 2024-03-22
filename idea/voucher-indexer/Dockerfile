FROM node:20-alpine

WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./idea/common idea/common
COPY ./idea/voucher-indexer idea/voucher-indexer

RUN yarn install

RUN yarn build:common
RUN yarn build:voucher-indexer

WORKDIR /src/idea/voucher-indexer

CMD ["node", "lib/main.js"]
