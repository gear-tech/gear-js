#![no_std]

use gstd::{exec, prelude::*, util};

#[no_mangle]
pub unsafe extern "C" fn handle() {}

gstd::metadata! {
    title: "Test syscalls in meta_state function",
    state:
        output: (u64, u32),
}

#[no_mangle]
pub unsafe extern "C" fn meta_state() -> *mut [i32; 2] {
    let ts = exec::block_timestamp();
    let block_height = exec::block_height();

    util::to_leak_ptr((ts, block_height).encode())
}
