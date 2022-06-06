#!/bin/bash

# '********************************* Cargo build *********************************'
cargo build --release --manifest-path ./build/Cargo.toml

if [ $? -eq 0 ]
then
  # '********************************* Wasm proc ***********************************'
  wasm-proc -p ./build/target/wasm32-unknown-unknown/release/*.wasm

  # '********************************** Copy ***************************************'
  cp ./build/target/wasm32-unknown-unknown/release/*.wasm ./build
  
  # '******************************* Remove target *********************************'
  rm -rf ./build/target
  exit 0
else
  # '******************************* Remove target *********************************'
  rm -rf ./build/target
  echo "Failed" >&2
  exit 1
fi



