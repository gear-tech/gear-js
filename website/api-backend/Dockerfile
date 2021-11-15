FROM node:16-alpine
WORKDIR /backend
COPY ./website/backend/ .
RUN yarn install 
RUN yarn build
CMD ["node", "dist/main"]
