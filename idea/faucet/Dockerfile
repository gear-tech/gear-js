FROM node:18-alpine as builder

WORKDIR /src

COPY package.json yarn.lock tsconfig.json .yarnrc.yml ./
COPY .yarn .yarn

COPY ./idea/common idea/common
COPY ./idea/faucet/ idea/faucet

RUN yarn install && \
    yarn build:common && \
    yarn build:faucet

FROM node:18-alpine

WORKDIR /src

COPY --from=builder /src/package.json .
COPY --from=builder /src/node_modules/ ./node_modules/

COPY --from=builder /src/idea/common/dist ./idea/common/dist
COPY --from=builder /src/idea/common/node_modules/ ./idea/common/node_modules/
COPY --from=builder /src/idea/common/package.json ./idea/common/

COPY --from=builder /src/idea/faucet/dist ./idea/faucet/dist
COPY --from=builder /src/idea/faucet/node_modules/ ./idea/faucet/node_modules/
COPY --from=builder /src/idea/faucet/package.json /src/idea/faucet/.env ./idea/faucet/

CMD ["node", "idea/faucet/dist/server.js"]