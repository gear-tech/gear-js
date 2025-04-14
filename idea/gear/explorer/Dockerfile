FROM node:20-alpine

WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .

COPY apis/gear/package.json apis/gear/package.json
COPY idea/gear/common/package.json idea/gear/common/package.json
COPY idea/gear/explorer/package.json idea/gear/explorer/package.json
COPY idea/gear/indexer-db/package.json idea/gear/indexer-db/package.json

RUN yarn workspaces focus --production

COPY . .

RUN yarn build:gear-idea-explorer

WORKDIR /src/idea/gear/explorer

CMD ["node", "dist/main.js"]
