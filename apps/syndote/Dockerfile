FROM node:16-alpine AS builder

ARG REACT_APP_SYNDOTE_NODE_ADDRESS  \
    REACT_APP_CONTRACT_ADDRESS
ENV REACT_APP_SYNDOTE_NODE_ADDRESS=${REACT_APP_SYNDOTE_NODE_ADDRESS} \
    REACT_APP_CONTRACT_ADDRESSS=${REACT_APP_CONTRACT_ADDRESS}

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./apps/syndote apps/syndote

RUN yarn install
RUN yarn build:syndote

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /src/apps/syndote/build /usr/share/nginx/html
