FROM node:16-alpine
WORKDIR /backend
COPY ./website/backend/ .
RUN rm package-lock.json
RUN npm install
RUN npm run build
CMD ["node", "dist/main"]
