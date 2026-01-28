FROM node:20-bookworm AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus varaeth-idea-frontend @vara-eth/api @gear-js/api @gear-js/sails-payload-form gear-js

RUN yarn add -D storybook@8

ARG VITE_WALLET_CONNECT_PROJECT_ID \
    VITE_VARA_ETH_NODE_ADDRESS \
    VITE_ETH_NODE_ADDRESS \
    VITE_ETH_CHAIN_ID \
    VITE_EXPLORER_URL \
    VITE_ROUTER_CONTRACT_ADDRESS

ENV VITE_WALLET_CONNECT_PROJECT_ID=${VITE_WALLET_CONNECT_PROJECT_ID} \
    VITE_VARA_ETH_NODE_ADDRESS=${VITE_VARA_ETH_NODE_ADDRESS} \
    VITE_ETH_NODE_ADDRESS=${VITE_ETH_NODE_ADDRESS} \
    VITE_ETH_CHAIN_ID=${VITE_ETH_CHAIN_ID} \
    VITE_EXPLORER_URL=${VITE_EXPLORER_URL} \
    VITE_ROUTER_CONTRACT_ADDRESS=${VITE_ROUTER_CONTRACT_ADDRESS} \
    DISABLE_ESLINT_PLUGIN=true \
    ESLINT_NO_DEV_ERRORS=true

RUN yarn build:varaeth-idea-frontend

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /src/idea/vara-eth/frontend/dist /usr/share/nginx/html
