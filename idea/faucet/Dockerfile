FROM node:18-alpine as builder

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./idea/common idea/common
COPY ./idea/test-balance/ idea/test-balance
RUN yarn install
RUN yarn build:common
RUN yarn build:test-balance
CMD ["node", "idea/test-balance/dist/main.js"]
