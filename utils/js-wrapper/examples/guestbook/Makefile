build:
	RUSTFLAGS="-C link-args=--import-memory" cargo +nightly build --target wasm32-unknown-unknown --release

wasm-proc:
	wasm-proc -p target/wasm32-unknown-unknown/release/bindgen_guestbook.wasm

bindgen_web:
	wasm-bindgen target/wasm32-unknown-unknown/release/wrapper.wasm --out-dir ./pkg_web/ --target web

bindgen_node:
	wasm-bindgen target/wasm32-unknown-unknown/release/wrapper.wasm --out-dir ./pkg_node/ --target nodejs --omit-default-module-path

wrap_web:
	gear-js-wrapper pkg_web --target web --ts

wrap_node:
	gear-js-wrapper pkg_node --target nodejs --ts