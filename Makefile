pre-commit:
	@pnpm install
	@pnpm run lint:fix
	@pnpm run build
	@pnpm run test

pre-commit-no-test:
	@pnpm install
	@pnpm run lint:fix
	@pnpm run build
