FROM node:18-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./idea/common idea/common
COPY ./idea/data-storage idea/data-storage
RUN yarn install
RUN yarn build:common
RUN yarn build:data-storage
WORKDIR /src/idea/data-storage

CMD ["node", "dist/main"]
