FROM node:16-alpine AS builder
WORKDIR /lottery
ARG REACT_APP_NODE_ADDRESS  \
    REACT_APP_LOTTERY_CONTRACT_ADDRESS
ENV REACT_APP_NODE_ADDRESS=${REACT_APP_NODE_ADDRESS} \
    REACT_APP_LOTTERY_CONTRACT_ADDRESS=${REACT_APP_LOTTERY_CONTRACT_ADDRESS}
COPY . /lottery
RUN npm install --force
RUN npm run build

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /lottery/build /usr/share/nginx/html
