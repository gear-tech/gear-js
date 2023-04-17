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

.PHONY: all clean build fmt build_lib build_examples
