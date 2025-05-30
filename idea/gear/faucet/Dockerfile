FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus @gear-js/api gear-idea-faucet gear-js gear-idea-common
RUN yarn build:gear-idea-faucet

FROM node:20-alpine AS deps

WORKDIR /deps

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY apis/gear/package.json apis/gear/package.json
COPY idea/gear/common/package.json idea/gear/common/package.json
COPY idea/gear/faucet/package.json idea/gear/faucet/package.json

RUN yarn workspaces focus @gear-js/api gear-idea-faucet gear-js gear-idea-common --production

FROM node:20-alpine

COPY --from=deps /deps /src
COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/common/dist /src/idea/gear/common/dist
COPY --from=builder /src/idea/gear/faucet/dist /src/idea/gear/faucet/dist
COPY --from=builder /src/idea/gear/faucet/swagger.yaml /src/idea/gear/faucet/swagger.yaml

WORKDIR /src/idea/gear/faucet

CMD ["node", "dist/main.js"]
