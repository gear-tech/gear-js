update:
	@cargo update --manifest-path test/programs/Cargo.toml

build: 
	@cargo +nightly build --release --manifest-path test/programs/Cargo.toml

clean:
	@rm -rf test/programs/target

all: clean update build

.PHONY: all clean build
