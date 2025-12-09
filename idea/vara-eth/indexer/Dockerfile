FROM node:22-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus @vara-eth/api varaeth-idea-indexer @gear-js/logger gear-js
RUN yarn build:vara-eth-api
RUN yarn build:varaeth-idea-indexer

FROM node:22-alpine AS deps
WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY idea/vara-eth/indexer/package.json idea/vara-eth/indexer/package.json
COPY apis/vara-eth/package.json apis/vara-eth/package.json
COPY utils/logger/package.json utils/logger/package.json

RUN yarn workspaces focus @vara-eth/api varaeth-idea-indexer @gear-js/logger gear-js --production

FROM deps

COPY --from=builder /src/idea/vara-eth/indexer/lib /src/idea/vara-eth/indexer/lib
COPY --from=builder /src/idea/vara-eth/indexer/db /src/idea/vara-eth/indexer/db
COPY --from=builder /src/apis/vara-eth/lib /src/apis/vara-eth/lib
COPY --from=builder /src/utils/logger/src /src/utils/logger/src

WORKDIR /src/idea/vara-eth/indexer

CMD ["yarn", "start"]
