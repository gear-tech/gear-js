build:
	RUSTFLAGS="-C link-args=--import-memory" cargo +nightly build --target wasm32-unknown-unknown --release

bindgen_web:
	wasm-bindgen target/wasm32-unknown-unknown/release/wrapper.wasm --out-dir ./pkg_web/ --target web

bindgen_node:
	wasm-bindgen target/wasm32-unknown-unknown/release/wrapper.wasm --out-dir ./pkg_node/ --target nodejs

wrap_web:
	gear-js-wrapper pkg_web --target web --ts

wrap_node:
	gear-js-wrapper pkg_node --target nodejs --ts