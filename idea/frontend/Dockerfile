FROM node:18-alpine AS builder
MAINTAINER GEAR

WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarnrc.yml .
COPY .yarn .yarn
COPY ./idea/frontend ./idea/frontend
COPY ./utils/gear-hooks ./utils/gear-hooks
COPY ./utils/gear-ui ./utils/gear-ui
COPY ./utils/wallet-connect ./utils/wallet-connect

RUN yarn install --mode=skip-build

ARG VITE_NODE_ADDRESS \
    VITE_API_URL \
    VITE_NODES_API_URL \
    VITE_DEFAULT_TRANSFER_BALANCE_VALUE \
    VITE_HCAPTCHA_SITE_KEY \
    VITE_GTM_ID \
    VITE_MAINNET_VOUCHERS_API_URL \
    VITE_TESTNET_VOUCHERS_API_URL \
    VITE_INDEXER_API_URL \
    VITE_DNS_API_URL
    
ENV VITE_NODE_ADDRESS=${VITE_NODE_ADDRESS} \
    VITE_VOUCHERS_API_URL=${VITE_VOUCHERS_API_URL} \
    VITE_API_URL=${VITE_API_URL} \
    VITE_NODES_API_URL=${VITE_NODES_API_URL} \
    VITE_DEFAULT_TRANSFER_BALANCE_VALUE=${VITE_DEFAULT_TRANSFER_BALANCE_VALUE} \
    VITE_HCAPTCHA_SITE_KEY=${VITE_HCAPTCHA_SITE_KEY} \
    VITE_GTM_ID=${VITE_GTM_ID} \
    VITE_MAINNET_VOUCHERS_API_URL=${VITE_MAINNET_VOUCHERS_API_URL} \
    VITE_TESTNET_VOUCHERS_API_URL=${VITE_TESTNET_VOUCHERS_API_URL} \
    VITE_INDEXER_API_URL=${VITE_INDEXER_API_URL} \
    VITE_DNS_API_URL=${VITE_DNS_API_URL}
    

RUN yarn build:frontend

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /src/idea/frontend/dist /usr/share/nginx/html
