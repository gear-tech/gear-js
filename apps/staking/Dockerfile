FROM node:19-alpine AS builder

ARG REACT_APP_NODE_ADDRESS  \
    REACT_APP_FTOKEN_CONTRACT_ADDRESS  \
    REACT_APP_DAPPS_API_ADDRESS \
    REACT_APP_STAKING_CONTRACT_ADDRESS
ENV REACT_APP_NODE_ADDRESS=${REACT_APP_NODE_ADDRESS} \
    REACT_APP_FTOKEN_CONTRACT_ADDRESS=${REACT_APP_FTOKEN_CONTRACT_ADDRESS} \
    REACT_APP_DAPPS_API_ADDRESS=${REACT_APP_DAPPS_API_ADDRESS} \
    REACT_APP_STAKING_CONTRACT_ADDRESS=${REACT_APP_STAKING_CONTRACT_ADDRESS}

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY ./apps/staking apps/staking

RUN yarn install
RUN yarn build:staking

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /src/apps/staking/build /usr/share/nginx/html
