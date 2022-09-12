#![no_std]

use gstd::msg;

#[no_mangle]
pub unsafe extern "C" fn init() {
    msg::reply("Init", 0).expect("Unable to send relpy");
}

#[gstd::async_main]
async fn main() {
    let _response = msg::send_bytes_with_gas_for_reply(msg::source(), b"PING", 1000000, 0)
        .expect("")
        .await
        .expect("Error in async");
    msg::reply_bytes(b"ok", 0).unwrap();
}
