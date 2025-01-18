FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn install
RUN yarn build:gear-idea-backend

FROM node:20-alpine AS deps
WORKDIR /deps

COPY package.json .
COPY yarn.lock .
COPY idea/gear/common/package.json .
COPY idea/gear/explorer/package.json .
COPY idea/gear/indexer-db/package.json .

RUN yarn install --production

FROM node:20-alpine

COPY --from=deps /deps /src
COPY --from=builder /src/idea/common/dist /src/idea/common/dist
COPY --from=builder /src/idea/gear/explorer/dist /src/idea/gear/explorer/dist
COPY --from=builder /src/idea/gear/indexer-db/dist /src/idea/gear/indexer-db/dist

WORKDIR /src/idea/gear/explorer


CMD ["node", "dist/main.js"]
