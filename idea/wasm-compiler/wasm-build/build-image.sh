#!/bin/bash

echo "*** Building... ***"
docker build ./wasm-build -t wasm-build
echo "*** The builld was sucessful ***"