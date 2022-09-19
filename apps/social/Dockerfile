FROM node:16-alpine AS builder

ARG REACT_APP_NODE_ADDRESS  \
    REACT_APP_ROUTER_CONTRACT_ADDRESS \
    REACT_APP_META_STORAGE_API 
ENV REACT_APP_NODE_ADDRESS=${REACT_APP_NODE_ADDRESS} \
    REACT_APP_ROUTER_CONTRACT_ADDRESS=${REACT_APP_ROUTER_CONTRACT_ADDRESS} \
    REACT_APP_META_STORAGE_API=${REACT_APP_META_STORAGE_API}

WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./apps/social apps/social

RUN yarn install
RUN yarn build:social

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /src/apps/social/build /usr/share/nginx/html
