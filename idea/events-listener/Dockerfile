FROM node:16-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./idea/common idea/common
COPY ./idea/events-listener idea/events-listener
RUN yarn install
RUN yarn build:common
RUN yarn build:events-listener
CMD ["node", "--experimental-specifier-resolution=node", "idea/events-listener/dist/main.js"]
