FROM node:18-alpine AS builder

WORKDIR /opt

RUN apk add --no-cache xsel

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

ARG VITE_WALLET_CONNECT_PROJECT_ID
ARG VITE_GEAR_API_NODE
ARG VITE_ETH_NODE_ADDRESS
ARG VITE_CONTRACT_ADDRESS

ENV VITE_WALLET_CONNECT_PROJECT_ID=${VITE_WALLET_CONNECT_PROJECT_ID} \
    VITE_CONTRACT_ADDRESS=${VITE_CONTRACT_ADDRESS} \
    VITE_GEAR_API_NODE=${VITE_GEAR_API_NODE} \
    VITE_ETH_NODE_ADDRESS=${VITE_ETH_NODE_ADDRESS} \
    DISABLE_ESLINT_PLUGIN=true

RUN yarn build && yarn cache clean


FROM node:18-alpine

WORKDIR /opt

RUN npm install --global serve

COPY --from=builder /opt/dist ./dist

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

EXPOSE 4173

CMD ["serve", "-s", "dist"]
