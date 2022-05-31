#![no_std]

extern crate gstd;

#[gstd::async_main]
async fn main() {
    gstd::exec::wait();
}
