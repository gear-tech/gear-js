FROM node:20-alpine AS builder

WORKDIR /src

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build:gear-idea-squid
RUN pnpm deploy --filter gear-idea-squid /deploy --prod

FROM node:20-alpine

RUN corepack enable

COPY --from=builder /deploy /src/idea/gear/squid
COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/squid/lib /src/idea/gear/squid/lib
COPY --from=builder /src/idea/gear/indexer-db/lib /src/idea/gear/indexer-db/lib
COPY --from=builder /src/idea/gear/common/dist /src/idea/gear/common/dist
COPY --from=builder /src/idea/gear/squid/db /src/idea/gear/squid/db
COPY --from=builder /src/idea/gear/squid/assets /src/idea/gear/squid/assets

WORKDIR /src/idea/gear/squid

CMD ["pnpm", "run", "run-with-migrations"]
