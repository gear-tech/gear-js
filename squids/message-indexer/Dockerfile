FROM node:18-alpine


WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./squids/message-indexer squids/message-indexer
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN yarn install
RUN yarn build:message-indexer

CMD ["node", "idea/message-indexer/lib/main"]
