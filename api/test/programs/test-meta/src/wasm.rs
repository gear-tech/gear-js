use crate::{Action, Wallet};
use gstd::{msg, prelude::*};
use test_meta_io::EmptyStruct;

#[no_mangle]
unsafe extern "C" fn handle() {
    let message_in: Action = msg::load().unwrap();

    msg::reply(EmptyStruct { empty: () }, 0).unwrap();
}

#[no_mangle]
extern "C" fn metahash() {
    let metahash: [u8; 32] = include!("../.metahash");
    let t = Result::Ok("()");
    msg::reply(metahash, 0).expect("Failed to share metahash");
}
