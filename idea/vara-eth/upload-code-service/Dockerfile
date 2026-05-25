FROM node:24-alpine AS builder

WORKDIR /src

RUN apk add --no-cache python3 make g++

COPY . .

RUN yarn workspaces focus @vara-eth/api @vara-eth/idea-upload-code @gear-js/logger gear-js
RUN yarn build:vara-eth-api
RUN yarn workspace @vara-eth/idea-upload-code run build

FROM node:24-alpine AS deps

WORKDIR /src

RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY idea/vara-eth/upload-code-service/package.json idea/vara-eth/upload-code-service/package.json
COPY apis/vara-eth/package.json apis/vara-eth/package.json
COPY utils/logger/package.json utils/logger/package.json

RUN yarn workspaces focus @vara-eth/api @vara-eth/idea-upload-code @gear-js/logger gear-js --production

FROM deps

COPY --from=builder /src/apis/vara-eth/lib /src/apis/vara-eth/lib
COPY --from=builder /src/idea/vara-eth/upload-code-service/dist /src/idea/vara-eth/upload-code-service/dist
COPY --from=builder /src/utils/logger/src /src/utils/logger/src
COPY --from=builder /src/apis/vara-eth/lib /src/node_modules/@vara-eth/api/lib

WORKDIR /src/idea/vara-eth/upload-code-service

CMD ["node", "dist/main.js"]
