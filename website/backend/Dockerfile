FROM node:14-alpine
WORKDIR /backend
COPY ./backend/ .
RUN npm install && npm run build
CMD ["node", "dist/main"]
