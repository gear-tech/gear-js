build-waitlist:
	cargo build --release --manifest-path ./test-waitlist/Cargo.toml

wasm-proc-waitlist:
	wasm-proc -p test-waitlist/target/wasm32-unknown-unknown/release/test_waitlist.wasm

cp-waitlist: 
	cp test-waitlist/target/wasm32-unknown-unknown/release/test_waitlist.*.wasm ../wasm

all-waitlist: build-waitlist wasm-proc-waitlist cp-waitlist


build-gas:
	cargo build --release --manifest-path ./test-gas/Cargo.toml

wasm-proc-gas:
	wasm-proc -p test-gas/target/wasm32-unknown-unknown/release/test_gas.wasm

cp-gas: 
	cp test-gas/target/wasm32-unknown-unknown/release/test_gas.*.wasm ../wasm

all-gas: build-gas wasm-proc-gas cp-gas


all: all-waitlist all-gas


clean:
	rm -rf ./**/target

.PHONY: all all-gas all-waitlist clean
