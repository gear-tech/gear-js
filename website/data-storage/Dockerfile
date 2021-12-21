FROM node:16-alpine
COPY ./website/api-interfaces /usr/src/api-interfaces
COPY ./website/data-storage /usr/src/data-storage
WORKDIR /usr/src/api-interfaces
RUN yarn install
RUN yarn build
WORKDIR /usr/src/data-storage
RUN yarn set version berry
RUN yarn install
RUN yarn build
CMD ["node", "dist/main"]
