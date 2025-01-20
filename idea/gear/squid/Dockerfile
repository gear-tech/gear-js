FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

# TODO: This command exited with non-zero code inside Docker container.
# But with echo $? it returned 0. Need to investigate.
RUN yarn workspaces focus @gear-js/api gear-idea-squid gear-idea-indexer-db gear-js; echo $?
RUN yarn build:gear-idea-squid

FROM node:20-alpine AS deps
WORKDIR /deps

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY apis/gear/package.json apis/gear/package.json
COPY idea/gear/squid/package.json idea/gear/squid/package.json
COPY idea/gear/indexer-db/package.json idea/gear/indexer-db/package.json

RUN yarn workspaces focus --production

FROM node:20-alpine

COPY --from=deps /deps /src
COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/squid/lib /src/idea/gear/squid/lib
COPY --from=builder /src/idea/gear/indexer-db/lib /src/idea/gear/indexer-db/lib

WORKDIR /src/idea/gear/squid


CMD ["yarn", "run-with-migrations"]
