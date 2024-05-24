#![no_std]

#[cfg(target_arch = "wasm32")]
pub use ping_app::wasm::*;
