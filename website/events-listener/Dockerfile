FROM node:16-alpine
COPY ./website/events-listener /usr/src/events-listener
WORKDIR /usr/src/events-listener
RUN yarn install
CMD ["yarn", "start"]
