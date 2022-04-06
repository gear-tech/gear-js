FROM node:17-alpine

WORKDIR /src
COPY package.json .
COPY yarn.lock .
COPY ./website/interfaces website/interfaces
COPY ./website/data-storage website/data-storage
RUN yarn install
RUN yarn build:interfaces
RUN yarn build:data-storage

CMD ["node", "website/data-storage/dist/main"]
