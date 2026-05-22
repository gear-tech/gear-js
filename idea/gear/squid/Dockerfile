FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus @gear-js/api gear-idea-squid gear-idea-indexer-db gear-idea-common gear-js
RUN yarn build:gear-idea-squid

FROM node:20-alpine AS deps
WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY apis/gear/package.json apis/gear/package.json
COPY idea/gear/squid/package.json idea/gear/squid/package.json
COPY idea/gear/indexer-db/package.json idea/gear/indexer-db/package.json
COPY idea/gear/common/package.json idea/gear/common/package.json

RUN yarn workspaces focus @gear-js/api gear-idea-squid gear-idea-indexer-db gear-idea-common gear-js --production

FROM deps

COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/squid/lib /src/idea/gear/squid/lib
COPY --from=builder /src/idea/gear/indexer-db/lib /src/idea/gear/indexer-db/lib
COPY --from=builder /src/idea/gear/common/dist /src/idea/gear/common/dist
COPY --from=builder /src/idea/gear/squid/db /src/idea/gear/squid/db

WORKDIR /src/idea/gear/squid

CMD ["yarn", "run-with-migrations"]
