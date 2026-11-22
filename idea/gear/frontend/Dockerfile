FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS builder

WORKDIR /src

COPY . .

RUN yarn workspaces focus gear-idea-frontend @gear-js/api @gear-js/react-hooks @gear-js/ui @gear-js/wallet-connect @gear-js/vara-ui @gear-js/sails-payload-form gear-js

ARG VITE_NODE_ADDRESS \
    VITE_NODES_API_URL \
    VITE_FAUCET_API_URL \
    VITE_METADATA_STORAGE_API_URL \
    VITE_DEFAULT_TRANSFER_BALANCE_VALUE \
    VITE_TURNSTILE_SITEKEY \
    VITE_GTM_ID \
    VITE_INDEXER_API_URL \
    VITE_CODE_VERIFIER_API_URL \
    VITE_VFT_WHITELIST_API_URL

ENV VITE_NODE_ADDRESS=${VITE_NODE_ADDRESS} \
    VITE_NODES_API_URL=${VITE_NODES_API_URL} \
    VITE_FAUCET_API_URL=${VITE_FAUCET_API_URL} \
    VITE_METADATA_STORAGE_API_URL=${VITE_METADATA_STORAGE_API_URL} \
    VITE_DEFAULT_TRANSFER_BALANCE_VALUE=${VITE_DEFAULT_TRANSFER_BALANCE_VALUE} \
    VITE_TURNSTILE_SITEKEY=${VITE_TURNSTILE_SITEKEY} \
    VITE_GTM_ID=${VITE_GTM_ID} \
    VITE_INDEXER_API_URL=${VITE_INDEXER_API_URL} \
    VITE_CODE_VERIFIER_API_URL=${VITE_CODE_VERIFIER_API_URL} \
    VITE_VFT_WHITELIST_API_URL=${VITE_VFT_WHITELIST_API_URL}

RUN yarn build:gear-idea-frontend

FROM public.ecr.aws/nginx/nginx-unprivileged:1.31.9-alpine-slim@sha256:75e85a09b0f25bd46d49a9fd85589ffa70b0459c8ed5ee0dc6596fd642e1f829

COPY idea/gear/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /src/idea/gear/frontend/dist /app/dist

EXPOSE 3000
