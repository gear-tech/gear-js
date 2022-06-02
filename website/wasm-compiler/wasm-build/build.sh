#!/bin/bash

echo '******************************* Cargo build *******************************'
cargo build --release --manifest-path ./build/Cargo.toml
echo '******************************* Wasm proc *********************************'
wasm-proc -p ./build/target/wasm32-unknown-unknown/release/*.wasm
echo '******************************* Copy **************************************'
cp ./build/target/wasm32-unknown-unknown/release/*.wasm ./build
echo '******************************* Remove target *********************************'
rm -r ./build/target