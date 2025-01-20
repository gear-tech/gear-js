pre-commit:
	@yarn install
	@yarn lint:fix
	@yarn build:all
	@yarn test

pre-commit-no-test:
	@yarn install
	@yarn lint:fix
	@yarn build:all
