#!/bin/bash

echo '******************************* Cargo build *******************************'
cargo +nightly build --release --manifest-path ./build/Cargo.toml --target wasm32-unknown-unknown
echo '******************************* Wasm proc *********************************'
wasm-proc -p ./build/target/wasm32-unknown-unknown/release/*.wasm
echo '******************************* Copy **************************************'
cp ./build/target/wasm32-unknown-unknown/release/*.wasm ./build
echo '******************************* Remove target *********************************'
rm -r ./build/target