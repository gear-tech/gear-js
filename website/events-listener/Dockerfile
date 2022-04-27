FROM node:18-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./website/interfaces website/interfaces
COPY ./website/events-listener website/events-listener
RUN yarn install
RUN yarn build:interfaces
RUN yarn build:events-listener
CMD ["node", "--experimental-specifier-resolution=node", "website/events-listener/dist/index.js"]
