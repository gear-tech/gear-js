pre-commit:
	@yarn install
	@yarn lint:fix
	@yarn build
	@yarn test

pre-commit-no-test:
	@yarn install
	@yarn lint:fix
	@yarn build
