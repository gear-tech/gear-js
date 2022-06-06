#!/bin/bash

docker run --mount type=bind,source=$PROJECT_PATH,target=/wasm-build/build -a stdout -a stderr wasm-build
