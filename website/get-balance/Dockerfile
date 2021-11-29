FROM node:16-alpine
WORKDIR /get-balance
COPY ./website/get-balance/ .
RUN yarn install 
RUN yarn build
CMD ["node", "dist/main"]
