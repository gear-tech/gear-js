FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY gear-js.sh .


COPY idea/indexer-db ./idea/indexer-db
COPY idea/explorer ./idea/explorer
COPY idea/common ./idea/common

RUN yarn install

RUN ./gear-js.sh build common
RUN ./gear-js.sh build indexer-db
RUN ./gear-js.sh build explorer

CMD ["/bin/sh", "-c", "/src/gear-js.sh run explorer"]
