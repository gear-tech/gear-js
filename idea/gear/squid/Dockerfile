FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus @gear-js/api gear-idea-squid gear-idea-indexer-db gear-js
RUN yarn build:gear-idea-squid

WORKDIR /src/idea/gear/squid


CMD ["yarn", "start"]
