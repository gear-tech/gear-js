#![no_std]

use gstd::msg;

#[no_mangle]
unsafe extern "C" fn init() {
    msg::reply("ok", 0).unwrap();
}
