FROM node:16-alpine AS builder
WORKDIR /frontend
COPY ./website/frontend .
RUN rm package-lock.json
RUN npm install
RUN npm run build

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /frontend/build /usr/share/nginx/html
