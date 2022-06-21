FROM node:16-alpine
WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./website/common website/common
COPY ./website/test-balance/ website/test-balance
RUN yarn install
RUN yarn build:common
RUN yarn build:test-balance
CMD ["node", "website/test-balance/dist/main.js"]
