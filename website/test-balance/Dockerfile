FROM node:18-alpine
WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./website/jsonrpc-errors website/jsonrpc-errors
COPY ./website/test-balance/ website/test-balance
RUN yarn install
RUN yarn build:jsonrpc-errors
RUN yarn build:test-balance
CMD ["node", "website/test-balance/build/index.js"]