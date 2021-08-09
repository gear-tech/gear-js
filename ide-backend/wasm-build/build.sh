#!/bin/bash

cargo +nightly build --release --target wasm32-unknown-unknown
wasm-proc target/wasm32-unknown-unknown/release/*.wasm
if test -e target/wasm32-unknown-unknown/release/*meta.wasm;
then mv target/wasm32-unknown-unknown/release/*meta.wasm .; fi
if test -e target/wasm32-unknown-unknown/release/*opt.wasm;
then mv target/wasm32-unknown-unknown/release/*opt.wasm .; fi
rm -r target