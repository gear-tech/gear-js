use wasm_bindgen::prelude::*;
use gstd::prelude::*;
use scale_info::TypeInfo;
use codec::{Decode, Encode};
use serde::{Serialize};

pub fn decode<D: Decode>(bytes: Vec<u8>) -> Result<D, String> {
    D::decode(&mut bytes.as_ref()).map_err(|_| String::from("Unable to decode"))
}

#[derive(TypeInfo, Decode, Encode, Serialize)]
pub struct MessageIn {
    pub author: String,
    pub msg: String,
}

#[wasm_bindgen]
pub fn __send_add_message(author: String, msg: String) -> Vec<u8> {
    let mut v: Vec<u8> = Vec::new();
    v.push(0);
    let mut m = MessageIn { author, msg }.encode();
    v.append(&mut m);
    v
}

#[wasm_bindgen]
pub fn __send_delete_message(msg_number: i32) -> Vec<u8> {
    let mut v: Vec<u8> = Vec::new();
    v.push(1);
    v.append(&mut msg_number.encode());
    v
}

#[wasm_bindgen]
pub fn __query_view_messages(author: Option<String>) -> Vec<u8> {
    author.encode()
}

#[wasm_bindgen]
pub fn __decode_view_messages(bytes: Vec<u8>) -> String {
    let m: Vec<MessageIn> = decode(bytes).unwrap();
    serde_json::to_string(&m).unwrap()
}