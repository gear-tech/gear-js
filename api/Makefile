init: 
	@rustup toolchain install nightly-2023-04-25 --component llvm-tools-preview
	@rustup target add wasm32-unknown-unknown --toolchain nightly-2023-04-25
	@rm -rf ~/.rustup/toolchains/nightly-aarch64-apple-darwin
	@ln -s ~/.rustup/toolchains/nightly-2023-04-25-aarch64-apple-darwin ~/.rustup/toolchains/nightly-aarch64-apple-darwin

update:
	@cargo update --manifest-path programs/Cargo.toml

build: 
	@cargo +nightly build --release --manifest-path programs/Cargo.toml

clean:
	@rm -rvf programs/target

fmt:
	@cargo fmt --manifest-path programs/Cargo.toml

all: clean update build

build_lib:
	@yarn build

build_examples:
	@cd examples && npm run build

.PHONY: all clean build fmt build_lib build_examples init
