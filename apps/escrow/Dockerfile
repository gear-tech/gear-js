FROM node:16-alpine AS builder
WORKDIR /escrow
ARG REACT_APP_NODE_ADDRESS
ENV REACT_APP_NODE_ADDRESS=${REACT_APP_NODE_ADDRESS}
COPY . /escrow
RUN npm install --force
RUN npm run build

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /escrow/build /usr/share/nginx/html
