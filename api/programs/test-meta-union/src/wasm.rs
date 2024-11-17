use gstd::{collections::BTreeMap, debug, msg, prelude::*};
use test_union_io::{Action, EmptyStruct, Id, InitInput, InputStruct, Person, Wallet};

static mut STATE: Vec<Wallet> = Vec::new();

#[no_mangle]
pub unsafe extern "C" fn init() {
    let input: InitInput = msg::load().expect("Failed to load InitInput");

    match input {
        InitInput::InputStruct(payload) => {
            if payload.input != "Init" {
                panic!("Wrong input");
            }
            msg::reply("Init", 0).expect("Unable to send relpy");
        }
        InitInput::BTreeSetInput(_) => {
            let mut res: BTreeMap<String, u8> = BTreeMap::new();

            STATE.insert(
                0,
                Wallet {
                    id: Id {
                        decimal: 0,
                        hex: Vec::from([0]),
                    },
                    person: Person {
                        surname: "Surname0".into(),
                        name: "Name0".into(),
                    },
                },
            );

            STATE.insert(
                1,
                Wallet {
                    id: Id {
                        decimal: 1,
                        hex: Vec::from([1]),
                    },
                    person: Person {
                        surname: "Surname1".into(),
                        name: "Name1".into(),
                    },
                },
            );

            res.insert("One".into(), 1);

            msg::reply(res, 0).unwrap();
        }
    }
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
        Action::Four(_) => {
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
        _ => msg::reply("ok", 0).unwrap(),
    };
}

#[no_mangle]
pub unsafe extern "C" fn state() {
    debug!("{:?}", msg::load_bytes());
    let input: Option<u32> = msg::load().expect("Unable to load input");
    let mut result: Vec<Wallet> = Vec::new();
    if input.is_some() {
        let wallet = unsafe { STATE.get(input.unwrap() as usize) };
        if wallet.is_some() {
            result.push(wallet.unwrap().clone());
        }
    } else {
        result = unsafe { STATE.clone() };
    }

    msg::reply(result, 0).expect("Error in state");
}
