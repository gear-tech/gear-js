FROM node:18-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./idea/common idea/common
COPY ./idea/indexer idea/indexer
RUN yarn install
RUN yarn build:common
RUN yarn build:indexer
WORKDIR /src/idea/indexer

CMD ["node", "dist/main"]
