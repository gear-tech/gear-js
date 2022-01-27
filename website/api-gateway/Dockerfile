FROM node:16-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY ./website/interfaces website/interfaces
COPY ./website/api-gateway website/api-gateway
RUN yarn install
RUN yarn build:api-gateway

CMD ["node", "website/api-gateway/dist/main"]
