FROM node:16-alpine
COPY ./website/api-interfaces /usr/src/api-interfaces
COPY ./website/api-gateway /usr/src/api-gateway
WORKDIR /usr/src/api-interfaces
RUN yarn install
RUN yarn build
WORKDIR /usr/src/api-gateway
RUN yarn install
RUN yarn build
CMD ["node", "dist/main"]
