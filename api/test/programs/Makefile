build-waitlist:
	cargo build --manifest-path ./test-waitlist/Cargo.toml

wasm-proc-waitlist:
	wasm-proc -p test-waitlist/target/wasm32-unknown-unknown/release/test_waitlist.wasm

cp-waitlist: 
	cp test-waitlist/target/wasm32-unknown-unknown/release/test_waitlist.*.wasm ../wasm

all: build-waitlist wasm-proc-waitlist cp-waitlist

clean:
	rm -rf ./**/target

.PHONY: all clean
