FROM node:18-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./idea/common idea/common
COPY ./idea/meta-storage-2 idea/meta-storage-2

RUN yarn install
RUN yarn build:common
RUN yarn workspace @gear-js/meta-storage-2 build

WORKDIR /src/idea/meta-storage-2
CMD ["node", "dist/server.js"]
