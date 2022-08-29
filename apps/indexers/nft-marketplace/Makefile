.PHONY: migration-generate
migration-generate: 
	@DB_HOST=mithriy.com DB_PORT=5432 DB_NAME=nft_squid npx squid-typeorm-migration generate

.PHONY: migration-apply
migration-apply: 
	@DB_HOST=mithriy.com DB_PORT=5432 DB_NAME=nft_squid npx squid-typeorm-migration apply

.PHONY: model-generate
model-generate:
	@npx squid-typeorm-codegen

.PHONY: run
run:
	@node dist/main.js

.PHONY: install
install: 
	@yarn install

.PHONY: build
build: 
	@yarn build

.PHONY: clear-migrations
clear-migrations: 
	@rm db/migrations/*

.PHONY: all
all: build run

.PHONY: serve
serve: 
	@npx squid-graphql-server
