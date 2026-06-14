FROM node:20-slim AS builder

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

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g serve@14

COPY --from=builder --chown=node:node /src/idea/gear/frontend/dist ./dist

USER node

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
