FROM node:14-alpine
WORKDIR /backend
COPY ./website/backend/ .
RUN rm package-lock.json && npm install && npm run build
CMD ["node", "dist/main"]
