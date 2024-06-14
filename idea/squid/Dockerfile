FROM node:20-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./idea/indexer-db idea/indexer-db
COPY ./idea/squid idea/squid

RUN yarn install
RUN yarn build:squid

WORKDIR /src/idea/squid

CMD ["yarn migration:apply", "&&", "node", "lib/main.js"]
