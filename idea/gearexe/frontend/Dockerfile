FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

RUN corepack enable && corepack prepare yarn@stable --activate

RUN yarn set version stable
RUN yarn install

RUN yarn workspaces focus gearexe-idea-frontend gear-js

ARG VITE_WALLET_CONNECT_PROJECT_ID \
    VITE_GEAR_EXE_NODE_ADDRESS \
    VITE_ETH_NODE_ADDRESS


ENV VITE_WALLET_CONNECT_PROJECT_ID=${VITE_WALLET_CONNECT_PROJECT_ID} \
    VITE_GEAR_EXE_NODE_ADDRESS=${VITE_GEAR_EXE_NODE_ADDRESS} \
    VITE_ETH_NODE_ADDRESS=${VITE_ETH_NODE_ADDRESS} \
    DISABLE_ESLINT_PLUGIN=true

RUN yarn build:gearexe-idea-frontend

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /src/idea/gearexe/frontend/dist /usr/share/nginx/html
