FROM node:18-alpine AS builder

WORKDIR /src

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarnrc.yml .
COPY .yarn .yarn
COPY ./idea/frontend ./idea/frontend
COPY ./utils/gear-hooks ./utils/gear-hooks
COPY ./utils/gear-ui ./utils/gear-ui

RUN yarn install --mode=skip-build

ARG REACT_APP_API_URL \
    REACT_APP_NODE_ADDRESS \
    REACT_APP_WASM_COMPILER_URL \
    REACT_APP_DEFAULT_NODES_URL \
    REACT_APP_HCAPTCHA_SITE_KEY \
    REACT_APP_DEFAULT_TRANSFER_BALANCE_VALUE \
    REACT_APP_RRT
ENV REACT_APP_API_URL=${REACT_APP_API_URL} \
    REACT_APP_NODE_ADDRESS=${REACT_APP_NODE_ADDRESS} \
    REACT_APP_WASM_COMPILER_URL=${REACT_APP_WASM_COMPILER_URL} \
    REACT_APP_DEFAULT_NODES_URL=${REACT_APP_DEFAULT_NODES_URL} \
    REACT_APP_HCAPTCHA_SITE_KEY=${REACT_APP_HCAPTCHA_SITE_KEY} \
    REACT_APP_DEFAULT_TRANSFER_BALANCE_VALUE=${REACT_APP_DEFAULT_TRANSFER_BALANCE_VALUE} \
    REACT_APP_RRT=''

RUN yarn build:frontend

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /src/idea/frontend/build /usr/share/nginx/html
