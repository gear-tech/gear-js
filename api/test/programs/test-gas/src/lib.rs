#![no_std]

use gstd::{msg, prelude::*};

#[no_mangle]
pub unsafe extern "C" fn handle() {
    let mut calc = Vec::new();

    for i in 0..500 {
        calc.push(i);
    }

    msg::reply_bytes("ok", msg::value()).unwrap();
}

#[no_mangle]
pub unsafe extern "C" fn handle_reply() {
    msg::reply_bytes("ok handle reply", 0).unwrap();
}
