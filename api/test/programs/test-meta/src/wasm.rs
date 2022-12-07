use crate::{Action, Id, Person, Wallet};
use gstd::{msg, prelude::*, BTreeMap};
use test_meta_io::EmptyStruct;

static mut STATE: Vec<Wallet> = Vec::new();

#[no_mangle]
unsafe extern "C" fn init() {
    let message_in: BTreeSet<u8> = msg::load().expect("Unable to decode message");

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
#[no_mangle]
unsafe extern "C" fn handle() {
    let action: Action = msg::load().unwrap();

    match action {
        Action::One(option_string) => msg::reply(EmptyStruct { empty: () }, 1000).unwrap(),
        _ => msg::reply(EmptyStruct { empty: () }, 0).unwrap(),
    };
}

#[no_mangle]
extern "C" fn state() {
    msg::reply(unsafe { STATE.clone() }, 0).expect("Error in state");
}

#[no_mangle]
extern "C" fn metahash() {
    let metahash: [u8; 32] = include!("../.metahash");
    msg::reply(metahash, 0).expect("Failed to share metahash");
}
