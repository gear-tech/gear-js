FROM node:18-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./website/interfaces website/interfaces
COPY ./website/jsonrpc-errors website/jsonrpc-errors
COPY ./website/api-gateway website/api-gateway
RUN yarn install
RUN yarn build:interfaces
RUN yarn build:jsonrpc-errors
RUN yarn build:api-gateway

CMD ["node", "website/api-gateway/dist/main"]
