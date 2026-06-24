FROM node:24-alpine AS builder

WORKDIR /src

RUN apk add --no-cache python3 make g++

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build:vara-eth-api
RUN pnpm --filter @vara-eth/idea-upload-code run build
RUN pnpm deploy --filter @vara-eth/idea-upload-code /deploy --prod

FROM node:24-alpine

COPY --from=builder /deploy /src/idea/vara-eth/upload-code-service
COPY --from=builder /src/apis/vara-eth/lib /src/apis/vara-eth/lib
COPY --from=builder /src/idea/vara-eth/upload-code-service/dist /src/idea/vara-eth/upload-code-service/dist
COPY --from=builder /src/utils/logger/src /src/utils/logger/src
COPY --from=builder /src/apis/vara-eth/lib /src/node_modules/@vara-eth/api/lib

WORKDIR /src/idea/vara-eth/upload-code-service

CMD ["node", "dist/main.js"]
