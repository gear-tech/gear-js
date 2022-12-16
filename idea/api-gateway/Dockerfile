FROM node:18-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./idea/common idea/common
COPY ./idea/api-gateway idea/api-gateway
RUN yarn install
RUN yarn build:common
RUN yarn build:api-gateway

CMD ["node", "idea/api-gateway/dist/main"]
