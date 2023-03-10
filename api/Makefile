update:
	@cargo update --manifest-path test/programs/Cargo.toml

build: 
	@cargo +nightly build --release --manifest-path test/programs/Cargo.toml

clean:
	@rm -rvf test/programs/target

fmt:
	@cargo fmt --manifest-path test/programs/Cargo.toml

all: clean update build

.PHONY: all clean build
