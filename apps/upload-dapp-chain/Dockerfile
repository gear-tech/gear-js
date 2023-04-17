FROM node:19-alpine
MAINTAINER gear

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./apps/upload-dapp-chain/ apps/upload-dapp-chain/
RUN yarn install
RUN yarn build:upload-dapp-chain
CMD ["node", "/src/apps/upload-dapp-chain/dist/main.js"]
