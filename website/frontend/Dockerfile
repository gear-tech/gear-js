FROM node:16-alpine AS builder
WORKDIR /frontend
COPY ./website/frontend .
RUN yarn install
RUN yarn build

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /frontend/build /usr/share/nginx/html
