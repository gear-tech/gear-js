build-waitlist:
	cd test-waitlist && RUSTFLAGS="-C link-args=--import-memory" cargo +nightly build --target wasm32-unknown-unknown --release 

wasm-proc-waitlist:
	wasm-proc -p test-waitlist/target/wasm32-unknown-unknown/release/test_waitlist.wasm

cp-waitlist: 
	cp test-waitlist/target/wasm32-unknown-unknown/release/test_waitlist.*.wasm ../wasm

all: build-waitlist wasm-proc-waitlist cp-waitlist

clear:
	rm -rf ./**/target

.PHONY: all clean