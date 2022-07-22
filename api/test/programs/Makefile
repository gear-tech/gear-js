build: 
	cargo build --release

cp: 
	cp target/wasm32-unknown-unknown/release/*.{opt,meta}.wasm ../wasm

all: build cp

clean:
	rm -rf ./**/target

.PHONY: all clean build cp
