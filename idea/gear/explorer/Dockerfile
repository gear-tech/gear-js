FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus @gear-js/api gear-idea-explorer gear-idea-common gear-idea-indexer-db gear-js
RUN yarn build:gear-idea-explorer

FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS deps
WORKDIR /deps

COPY package.json .
COPY yarn.lock .
COPY .yarn .yarn
COPY .yarnrc.yml .

COPY apis/gear/package.json apis/gear/package.json
COPY idea/gear/common/package.json idea/gear/common/package.json
COPY idea/gear/explorer/package.json idea/gear/explorer/package.json
COPY idea/gear/indexer-db/package.json idea/gear/indexer-db/package.json

RUN yarn workspaces focus @gear-js/api gear-idea-explorer gear-idea-common gear-idea-indexer-db gear-js --production

FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:6abfcb367ebc291572c774c1592a986be2ab26a2486f73093401327495a5962a

COPY --from=deps /deps/node_modules /src/node_modules
COPY --from=deps /deps/apis/gear /src/apis/gear
COPY --from=deps /deps/idea/gear/common /src/idea/gear/common
COPY --from=deps /deps/idea/gear/explorer /src/idea/gear/explorer
COPY --from=deps /deps/idea/gear/indexer-db /src/idea/gear/indexer-db
COPY --from=builder /src/apis/gear/lib /src/apis/gear/lib
COPY --from=builder /src/idea/gear/common/dist /src/idea/gear/common/dist
COPY --from=builder /src/idea/gear/explorer/dist /src/idea/gear/explorer/dist
COPY --from=builder /src/idea/gear/indexer-db/lib /src/idea/gear/indexer-db/lib

WORKDIR /src/idea/gear/explorer

CMD ["dist/main.js"]
