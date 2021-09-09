FROM node:14-alpine
WORKDIR /backend
COPY ./website/backend/ .
RUN npm install && npm run build
CMD ["node", "dist/main"]
