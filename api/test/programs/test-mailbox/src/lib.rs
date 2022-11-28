#![no_std]

use codec::{Decode, Encode};
use gstd::{msg, prelude::*};
use scale_info::TypeInfo;

#[derive(TypeInfo, Decode, Encode, Clone)]
struct Participant {
    name: String,
}

#[derive(TypeInfo, Decode)]
enum HandleInputAction {
    AddParticipant(Participant),
    ViewAllParticipants,
}

gstd::metadata! {
    title: "Test program to read mailbox",
    handle:
        input: HandleInputAction,
        output: Vec<Participant>,
}

static mut PARTICIPANTS: Vec<Participant> = Vec::new();

#[no_mangle]
unsafe extern "C" fn handle() {
    let input: HandleInputAction = msg::load().expect("Unable to load message");
    match input {
        HandleInputAction::AddParticipant(participant) => PARTICIPANTS.push(participant),
        HandleInputAction::ViewAllParticipants => {
            msg::reply(PARTICIPANTS.clone(), 1000).expect("Error during msg::reply");
        }
    }
}
