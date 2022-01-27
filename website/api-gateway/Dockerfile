FROM node:16-alpine
COPY ./website/api-gateway/dist /usr/src/api-gateway/dist
WORKDIR /usr/src/api-gateway
CMD ["node", "dist/main"]
