FROM node:16-alpine AS builder

ARG REACT_APP_NODE_ADDRESS \
    REACT_APP_DAPPS_API_ADDRESS
ENV REACT_APP_NODE_ADDRESS=${REACT_APP_NODE_ADDRESS} \
    REACT_APP_DAPPS_API_ADDRESS=${REACT_APP_DAPPS_API_ADDRESS}

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./apps/supply-chain apps/supply-chain
RUN yarn install
RUN yarn build:supply-chain

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /src/apps/supply-chain/build /usr/share/nginx/html
