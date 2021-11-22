FROM node:16-alpine
COPY ./website/api-interfaces /usr/src/api-interfaces
COPY ./website/data-storage /usr/src/data-storage
WORKDIR /usr/src/data-storage
RUN npm install
RUN npm run build
CMD ["node", "dist/main"]
