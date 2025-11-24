FROM node:22-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus @vara-eth/api varaeth-indexer gear-js
RUN yarn build:vara-eth-api
RUN yarn build:varaeth-idea-indexer

FROM node:22-alpine AS deps
WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY idea/vara-eth/indexer/package.json idea/vara-eth/indexer/package.json
COPY api/vara-eth/package.json api/vara-eth/package.json

RUN yarn workspaces focus @vara-eth/api varaeth-idea-indexer gear-js --production

FROM deps

COPY --from=builder /src/idea/vara-eth/indexer/lib /src/idea/vara-eth/indexer/lib
COPY --from=builder /src/api/vara-eth/lib /src/api/vara-eth/lib

WORKDIR /src/idea/vara-eth/indexer

CMD ["yarn", "start"]
