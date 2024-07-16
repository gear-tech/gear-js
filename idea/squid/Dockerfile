FROM node:20-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY gear-js.sh .
COPY ./idea/indexer-db idea/indexer-db
COPY ./idea/squid idea/squid
RUN chmod +x ./gear-js.sh

RUN yarn install
RUN ./gear-js.sh build indexer-db
RUN ./gear-js.sh build squid

CMD ["gear-js.sh", "run", "squid"]
