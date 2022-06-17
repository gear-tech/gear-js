#![no_std]

use gstd::{msg};

#[gstd::async_main]
async fn main() {
    let _response = msg::send_bytes_for_reply(msg::source(), b"PING", 0).expect("").await.expect("Error in async");
    msg::reply_bytes(b"ok", 0).unwrap();
}
