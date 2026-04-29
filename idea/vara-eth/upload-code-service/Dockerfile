FROM node:22-alpine AS builder

WORKDIR /src

RUN apk add --no-cache python3 make g++

COPY . .

RUN yarn workspaces focus @vara-eth/api upload-code-service
RUN yarn build:vara-eth-api
RUN yarn workspace upload-code-service run build

FROM node:22-alpine AS deps

WORKDIR /src

RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY idea/vara-eth/upload-code-service/package.json idea/vara-eth/upload-code-service/package.json
COPY apis/vara-eth/package.json apis/vara-eth/package.json

RUN yarn workspaces focus @vara-eth/api upload-code-service --production

FROM deps

COPY --from=builder /src/idea/vara-eth/upload-code-service/dist /src/idea/vara-eth/upload-code-service/dist

WORKDIR /src/idea/vara-eth/upload-code-service

CMD ["node", "dist/index.js"]
