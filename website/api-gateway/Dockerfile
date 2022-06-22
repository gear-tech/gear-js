FROM node:16-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./website/common website/common
COPY ./website/api-gateway website/api-gateway
RUN yarn install
RUN yarn build:common
RUN yarn build:api-gateway

CMD ["node", "website/api-gateway/dist/main"]
