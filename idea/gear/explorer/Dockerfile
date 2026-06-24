FROM node:20-alpine AS builder

WORKDIR /src

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build:gear-idea-explorer
RUN pnpm deploy --filter gear-idea-explorer /deploy --prod

FROM node:20-alpine

COPY --from=builder /deploy /src/idea/gear/explorer
COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/common/dist /src/idea/gear/common/dist
COPY --from=builder /src/idea/gear/explorer/dist /src/idea/gear/explorer/dist
COPY --from=builder /src/idea/gear/indexer-db/lib /src/idea/gear/indexer-db/lib

WORKDIR /src/idea/gear/explorer

CMD ["node", "dist/main.js"]
