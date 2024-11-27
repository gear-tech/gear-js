FROM node:18-alpine

WORKDIR /src

COPY package.json yarn.lock tsconfig.json .yarnrc.yml ./
COPY .yarn .yarn

COPY ./idea/common idea/common
COPY ./idea/faucet/ idea/faucet

RUN yarn install && \
    yarn build:common && \
    yarn build:faucet

WORKDIR /src/idea/faucet

CMD ["node", "dist/server.js"]
