FROM node:14-alpine

WORKDIR /backend
COPY . ./

RUN npm install && npm run build

EXPOSE 3000

CMD ["node", "dist/main"]