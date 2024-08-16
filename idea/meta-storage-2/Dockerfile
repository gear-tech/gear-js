FROM node:18-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./idea/common idea/common
COPY ./idea/meta-storage idea/meta-storage
RUN npm cache clean --force
RUN yarn cache clean
RUN yarn install
RUN yarn build:common
RUN yarn build:meta-storage
WORKDIR /src/idea/meta-storage

CMD ["node", "dist/src/server.js"]
