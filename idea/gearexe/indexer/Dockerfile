FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus gearexe-indexer gear-js
RUN yarn build:gearexe-indexer

FROM node:20-alpine AS deps
WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY idea/gearexe/indexer/package.json idea/gearexe/indexer/package.json

RUN yarn workspaces focus gearexe-indexer gear-js --production

FROM deps

COPY --from=builder /src/idea/gearexe/indexer/lib /src/idea/gearexe/indexer/lib

WORKDIR /src/idea/gearexe/indexer

CMD ["yarn", "start"]
