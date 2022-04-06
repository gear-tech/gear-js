FROM node:17-alpine
WORKDIR /test-balance
COPY ./website/test-balance/ .
RUN yarn install 
RUN yarn build
CMD ["node", "build/index.js"]