FROM node:20-alpine AS builder

WORKDIR /src

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build:gear-idea-meta-storage
RUN pnpm deploy --filter gear-idea-meta-storage /deploy --prod

FROM node:20-alpine

COPY --from=builder /deploy /src/idea/gear/meta-storage
COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/common/dist /src/idea/gear/common/dist
COPY --from=builder /src/idea/gear/meta-storage/dist /src/idea/gear/meta-storage/dist
COPY --from=builder /src/idea/gear/meta-storage/swagger.yaml /src/idea/gear/meta-storage/swagger.yaml

WORKDIR /src/idea/gear/meta-storage
CMD ["node", "dist/server.js"]
