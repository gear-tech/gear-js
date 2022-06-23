FROM node:16-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./website/common website/common
COPY ./website/events-listener website/events-listener
RUN yarn install
RUN yarn build:common
RUN yarn build:events-listener
CMD ["node", "--experimental-specifier-resolution=node", "website/events-listener/dist/main.js"]
