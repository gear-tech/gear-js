use gstd::msg;
use test_gas_io::InputStruct;

#[no_mangle]
pub unsafe extern "C" fn init() {
    let payload: InputStruct = msg::load().expect("Unable to decode message");
    if payload.input != "Init" {
        panic!("Wrong input");
    }
    msg::reply("Init", 0).expect("Unable to send relpy");
}

#[gstd::async_main]
async fn main() {
    let payload: InputStruct = msg::load().expect("Unable to decode message");

    if payload.input != "Handle" {
        panic!("Wrong input");
    }

    let response: InputStruct = msg::send_bytes_for_reply_as(msg::source(), b"PING", 0, 0)
        .expect("Unable to send message for reply")
        .await
        .expect("Error in async");

    if response.input != "Reply" {
        panic!("Wrong input");
    }
    msg::reply_bytes(b"ok", 0).unwrap();
}
