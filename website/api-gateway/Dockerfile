FROM node:16-alpine
COPY ./website/api-gateway /usr/src/api-gateway
WORKDIR /usr/src/api-gateway
RUN yarn install
RUN yarn build
CMD ["node", "dist/main"]
