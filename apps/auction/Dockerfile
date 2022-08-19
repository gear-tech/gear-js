FROM node:16-alpine AS builder
MAINTAINER gear

ARG REACT_APP_NODE_ADDRESS  \
    REACT_APP_IPFS_GATEWAY_ADDRESS \
    REACT_APP_AUCTION_CONTRACT_ADDRESS
ENV REACT_APP_NODE_ADDRESS=${REACT_APP_NODE_ADDRESS} \
    REACT_APP_IPFS_GATEWAY_ADDRESS=${REACT_APP_IPFS_GATEWAY_ADDRESS} \
    REACT_APP_AUCTION_CONTRACT_ADDRESS=${REACT_APP_AUCTION_CONTRACT_ADDRESS}

WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./apps/auction apps/auction

RUN yarn install
RUN yarn build

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /src/apps/auction/build /usr/share/nginx/html
