build:
	RUSTFLAGS="-C link-args=--import-memory" cargo +nightly build --target wasm32-unknown-unknown --release

wasm-proc:
	wasm-proc -p target/wasm32-unknown-unknown/release/bindgen_guestbook.wasm

bindgen-web:
	wasm-bindgen target/wasm32-unknown-unknown/release/wrapper.wasm --out-dir ./pkg_web/ --target web

bindgen-node:
	wasm-bindgen target/wasm32-unknown-unknown/release/wrapper.wasm --out-dir ./pkg_node/ --target nodejs --omit-default-module-path

wrap-web:
	../../bin/app.js pkg_web --target web --ts

wrap-node:
	../../bin/app.js pkg_node --target nodejs