FROM node:24-alpine AS builder

WORKDIR /src

RUN apk add --no-cache python3 make g++

COPY . .

RUN yarn workspaces focus @vara-eth/idea-indexer-db @vara-eth/idea-explorer @gear-js/logger gear-js
RUN yarn build:varaeth-idea-indexer-db
RUN yarn build:varaeth-idea-explorer

FROM node:24-alpine AS deps
WORKDIR /src

RUN apk add --no-cache python3 make g++

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY idea/vara-eth/explorer/package.json idea/vara-eth/explorer/package.json
COPY idea/vara-eth/indexer-db/package.json idea/vara-eth/indexer-db/package.json
COPY utils/logger/package.json utils/logger/package.json

RUN yarn workspaces focus @vara-eth/idea-indexer-db @vara-eth/idea-explorer @gear-js/logger gear-js --production

FROM deps

COPY --from=builder /src/idea/vara-eth/explorer/lib /src/idea/vara-eth/explorer/lib
COPY --from=builder /src/idea/vara-eth/indexer-db/lib /src/idea/vara-eth/indexer-db/lib
COPY --from=builder /src/utils/logger/src /src/utils/logger/src

WORKDIR /src/idea/vara-eth/explorer

CMD ["yarn", "start"]
