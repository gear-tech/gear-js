FROM node:16-alpine AS builder
WORKDIR /frontend
ARG REACT_APP_API_URL \
    REACT_APP_NODE_ADDRESS \
    REACT_APP_WASM_COMPILER_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL} \
    REACT_APP_NODE_ADDRESS=${REACT_APP_NODE_ADDRESS} \
    REACT_APP_WASM_COMPILER_URL=${REACT_APP_WASM_COMPILER_URL} \
    REACT_APP_RRT=''
COPY . /frontend
RUN npm install --force
RUN npm run build

FROM nginx:alpine
RUN rm -vf /usr/share/nginx/html/*
COPY --from=builder /frontend/build /usr/share/nginx/html
