### Waitlist

build-waitlist:
	cargo build --release --manifest-path ./test-waitlist/Cargo.toml

cp-waitlist: 
	cp test-waitlist/target/wasm32-unknown-unknown/release/test_waitlist.*.wasm ../wasm

all-waitlist: build-waitlist cp-waitlist

### Gas

build-gas:
	cargo build --release --manifest-path ./test-gas/Cargo.toml

cp-gas: 
	cp test-gas/target/wasm32-unknown-unknown/release/test_gas.*.wasm ../wasm

all-gas: build-gas  cp-gas

### Mailbox

build-mailbox:
	cargo build --release --manifest-path ./test-mailbox/Cargo.toml

cp-mailbox: 
	cp test-mailbox/target/wasm32-unknown-unknown/release/test_mailbox.*.wasm ../wasm

all-mailbox: build-mailbox cp-mailbox

### Syscals in state

build-syscalls-in-state:
	cargo build --release --manifest-path ./test-syscall-in-state/Cargo.toml

cp-syscalls-in-state: 
	cp test-syscall-in-state/target/wasm32-unknown-unknown/release/test_syscall_in_state.*.wasm ../wasm

all-syscalls-in-state: build-syscalls-in-state cp-syscalls-in-state


all: all-waitlist all-gas all-mailbox all-syscalls-in-state


clean:
	rm -rf ./**/target

.PHONY: all all-gas all-waitlist all-mailbox all-syscalls-in-state clean
