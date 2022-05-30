#![no_std]

use gstd::{msg, prelude::*};

gstd::metadata! {
    title: "test waitlist",
    handle:
        input: Vec<u8>,
        output: Vec<u8>,
}

#[gstd::async_main]
async fn main() {
    let reply: Result<String, _> = msg::send_and_wait_for_reply(msg::source(), String::from("to waitlist"), 0)
        .unwrap()
        .await;
}
