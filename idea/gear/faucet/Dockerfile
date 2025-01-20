FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus @gear-js/api gear-idea-faucet gear-js
RUN yarn build:gear-idea-faucet

FROM node:20-alpine AS deps

WORKDIR /deps

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY apis/gear/package.json apis/gear/package.json
COPY idea/gear/faucet/package.json idea/gear/faucet/package.json

RUN yarn workspaces focus --production

FROM node:20-alpine

COPY --from=deps /deps /src
COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/faucet/dist /src/idea/gear/faucet/dist

WORKDIR /src/idea/gear/faucet

CMD ["node", "dist/server.js"]
