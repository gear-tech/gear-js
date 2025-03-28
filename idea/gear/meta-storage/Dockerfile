FROM node:20-alpine AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus @gear-js/api gear-idea-common gear-idea-meta-storage gear-js
RUN yarn build:gear-idea-meta-storage

FROM node:20-alpine AS deps

WORKDIR /deps

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY apis/gear/package.json apis/gear/package.json
COPY idea/gear/common/package.json idea/gear/common/package.json
COPY idea/gear/meta-storage/package.json idea/gear/meta-storage/package.json

RUN yarn workspaces focus @gear-js/api gear-idea-common gear-idea-meta-storage gear-js --production

FROM node:20-alpine

COPY --from=deps /deps /src
COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/common/dist /src/idea/gear/common/dist
COPY --from=builder /src/idea/gear/meta-storage/dist /src/idea/gear/meta-storage/dist
COPY --from=builder /src/idea/gear/meta-storage/swagger.yaml /src/idea/gear/meta-storage/swagger.yaml

WORKDIR /src/idea/gear/meta-storage
CMD ["node", "dist/server.js"]
