.PHONY: migration-generate
migration-generate: 
	@yarn migration:generate

.PHONY: migration-apply
migration-apply: 
	@yarn migration:apply

.PHONY: model-generate
model-generate:
	@npx squid-typeorm-codegen

.PHONY: run
run:
	@node lib/main.js

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
	@yarn serve
