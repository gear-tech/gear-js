FROM node:16-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./website/common website/common
COPY ./website/data-storage website/data-storage
RUN yarn install
RUN yarn build:common
RUN yarn build:data-storage
WORKDIR /src/website/data-storage

CMD ["node", "dist/main"]
