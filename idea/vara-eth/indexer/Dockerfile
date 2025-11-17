FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus varaeth-indexer gear-js
RUN yarn build:varaeth-indexer

FROM node:20-alpine AS deps
WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY idea/vara-eth/indexer/package.json idea/vara-eth/indexer/package.json

RUN yarn workspaces focus varaeth-indexer gear-js --production

FROM deps

COPY --from=builder /src/idea/vara-eth/indexer/lib /src/idea/vara-eth/indexer/lib

WORKDIR /src/idea/vara-eth/indexer

CMD ["yarn", "start"]
