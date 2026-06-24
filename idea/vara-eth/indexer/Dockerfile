FROM node:24-alpine AS builder

WORKDIR /src

RUN apk add --no-cache python3 make g++

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build:vara-eth-api
RUN pnpm run build:varaeth-idea-indexer-db
RUN pnpm run build:varaeth-idea-indexer
RUN pnpm deploy --filter @vara-eth/idea-indexer /deploy --prod

FROM node:24-alpine

COPY --from=builder /deploy /src/idea/vara-eth/indexer
COPY --from=builder /src/idea/vara-eth/indexer/lib /src/idea/vara-eth/indexer/lib
COPY --from=builder /src/idea/vara-eth/indexer-db/lib /src/idea/vara-eth/indexer-db/lib
COPY --from=builder /src/idea/vara-eth/indexer-db/db /src/idea/vara-eth/indexer-db/db
COPY --from=builder /src/apis/vara-eth/lib /src/apis/vara-eth/lib
COPY --from=builder /src/utils/logger/src /src/utils/logger/src

WORKDIR /src/idea/vara-eth/indexer

CMD ["node", "lib/main.js"]
