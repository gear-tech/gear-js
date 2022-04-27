FROM node:18-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./website/interfaces website/interfaces
COPY ./website/jsonrpc-errors website/jsonrpc-errors
COPY ./website/data-storage website/data-storage
RUN yarn install
RUN yarn build:interfaces
RUN yarn build:jsonrpc-errors
RUN yarn build:data-storage

CMD ["node", "website/data-storage/dist/main"]
