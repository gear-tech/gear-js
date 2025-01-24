#![no_std]

extern crate gstd;

#[no_mangle]
unsafe extern "C" fn init() {
    gstd::msg::reply("ok", 0).unwrap();
}


#[gstd::async_main]
async fn main() {
    gstd::exec::wait();
}
