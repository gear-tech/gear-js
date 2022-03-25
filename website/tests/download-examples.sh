#!/bin/sh
rm -rf wasm
mkdir wasm
wget -O wasm/examples.tar.gz https://github.com/gear-tech/gear/releases/download/build/examples.tar.gz
cd wasm
tar -xvf examples.tar.gz
rm examples.tar.gz