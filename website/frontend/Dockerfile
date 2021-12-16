FROM node:16 AS builder
WORKDIR /frontend
COPY ./website/frontend .
RUN rm package-lock.json
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=builder /frontend/build /usr/share/nginx/html
