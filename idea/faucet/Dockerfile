FROM node:18-alpine

WORKDIR /src

COPY package.json yarn.lock tsconfig.json .yarnrc.yml ./
COPY .yarn .yarn

COPY ./idea/common idea/common
COPY ./idea/faucet/ idea/faucet

ARG WS_PROVIDER \
    TEST_ACCOUNT_SEED \
    TEST_BALANCE_VALUE \
    DB_NAME \
    DB_USER \
    DB_PASSWORD \
    DB_HOST
    
ENV WS_PROVIDER=${WS_PROVIDER} \
    TEST_ACCOUNT_SEED=${TEST_ACCOUNT_SEED} \
    TEST_BALANCE_VALUE=${TEST_BALANCE_VALUE} \
    DB_NAME=${DB_NAME} \
    DB_USER=${DB_USER} \
    DB_PASSWORD=${DB_PASSWORD} \
    DB_HOST=${DB_HOST}
    
RUN yarn install && \
    yarn build:common && \
    yarn build:faucet

WORKDIR /src/idea/faucet

CMD ["node", "dist/server.js"]
