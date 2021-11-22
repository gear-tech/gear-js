FROM node:16-alpine
COPY ./website/api-interfaces /usr/src/api-interfaces
COPY ./website/backend /usr/src/backend
WORKDIR /usr/src/api-interfaces
RUN yarn install
RUN yarn build
WORKDIR /usr/src/backend
RUN yarn install
RUN yarn build
CMD ["node", "dist/main"]
