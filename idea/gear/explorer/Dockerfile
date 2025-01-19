FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus @gear-js/api gear-idea-explorer gear-idea-common gear-idea-indexer-db gear-js
RUN yarn build:gear-idea-explorer

FROM node:20-alpine AS deps
WORKDIR /deps

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY apis/gear/package.json apis/gear/package.json
COPY idea/gear/common/package.json idea/gear/common/package.json
COPY idea/gear/explorer/package.json idea/gear/explorer/package.json
COPY idea/gear/indexer-db/package.json idea/gear/indexer-db/package.json

RUN yarn workspaces focus --production

FROM node:20-alpine

COPY --from=deps /deps /src
COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/common/dist /src/idea/gear/common/dist
COPY --from=builder /src/idea/gear/explorer/dist /src/idea/gear/explorer/dist
COPY --from=builder /src/idea/gear/indexer-db/lib /src/idea/gear/indexer-db/lib

WORKDIR /src/idea/gear/explorer


CMD ["node", "dist/main.js"]
