FROM node:20-alpine AS builder

WORKDIR /src

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build:gear-idea-faucet
RUN pnpm deploy --filter gear-idea-faucet /deploy --prod

FROM node:20-alpine

COPY --from=builder /deploy /src/idea/gear/faucet
COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/common/dist /src/idea/gear/common/dist
COPY --from=builder /src/idea/gear/faucet/dist /src/idea/gear/faucet/dist
COPY --from=builder /src/idea/gear/faucet/swagger.yaml /src/idea/gear/faucet/swagger.yaml

WORKDIR /src/idea/gear/faucet

CMD ["node", "dist/main.js"]
