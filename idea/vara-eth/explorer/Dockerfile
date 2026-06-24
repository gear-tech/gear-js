FROM node:24-alpine AS builder

WORKDIR /src

RUN apk add --no-cache python3 make g++

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build:varaeth-idea-indexer-db
RUN pnpm run build:varaeth-idea-explorer
RUN pnpm deploy --filter @vara-eth/idea-explorer /deploy --prod

FROM node:24-alpine

COPY --from=builder /deploy /src/idea/vara-eth/explorer
COPY --from=builder /src/idea/vara-eth/explorer/dist /src/idea/vara-eth/explorer/dist
COPY --from=builder /src/idea/vara-eth/indexer-db/lib /src/idea/vara-eth/indexer-db/lib
COPY --from=builder /src/utils/logger/src /src/utils/logger/src

WORKDIR /src/idea/vara-eth/explorer

CMD ["node", "dist/main.js"]
