#![no_std]

use codec::{Decode, Encode};
use gstd::{
    collections::{BTreeMap, BTreeSet},
    msg,
    prelude::*,
};

#[derive(Decode, Encode)]
pub enum Action {
    One(Option<String>),
    Two((u8, u16)),
    Four(),
    Input(String),
    Wait(),
}

#[derive(Decode, Encode)]
pub struct InputStruct {
    pub input: String,
}

#[derive(Encode, Decode, Clone)]
pub struct EmptyStruct {
    pub empty: (),
}

#[no_mangle]
unsafe extern "C" fn init() {
    let _: BTreeSet<u8> = msg::load().expect("Failed to load init arguments");

    let mut res: BTreeMap<String, u8> = BTreeMap::new();

    res.insert("One".into(), 1);

    msg::reply(res, 0).unwrap();
}

#[gstd::async_main]
async fn main() {
    let action: Action = msg::load().expect("Failed to load Action");

    match action {
        Action::One(_) => msg::send_with_gas(
            msg::source(),
            EmptyStruct { empty: () },
            10000000,
            10_000_000_000_000,
        )
        .unwrap(),
        Action::Four() => {
            let response: String = msg::send_for_reply_as(msg::source(), "reply", 0, 0)
                .expect("Unable to send msg for reply")
                .await
                .expect("Error in async");
            msg::reply(response, 0).unwrap()
        }
        Action::Input(input) => {
            if input != "Handle" {
                panic!("Wrong input");
            }

            let response: InputStruct = msg::send_bytes_for_reply_as(msg::source(), b"PING", 0, 0)
                .expect("Unable to send message for reply")
                .await
                .expect("Error in async");

            if response.input != "Reply" {
                panic!("Wrong input");
            }
            msg::reply_bytes(b"ok", 0).unwrap()
        }
        Action::Wait() => {
            gstd::exec::wait();
        }
        _ => msg::reply("ok", 0).unwrap(),
    };
}
