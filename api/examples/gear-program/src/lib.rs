#![no_std]

use codec::{Decode, Encode};
use gstd::{msg, prelude::*, ActorId, Clone};
use scale_info::TypeInfo;

#[derive(TypeInfo, Decode, Encode, Clone)]
pub struct SomeEvent {
    pub name_of_event: Option<String>,
}

#[derive(TypeInfo, Decode, Encode, Clone)]
pub struct Participant {
    pub id: u32,
    pub name: String,
    pub age: u8,
    pub public_key: ActorId,
}

#[derive(TypeInfo, Decode, Encode, Clone)]
pub struct State {
    info: SomeEvent,
    participants: Vec<Participant>,
}

#[derive(TypeInfo, Decode)]
pub enum Action {
    AddParticipant { name: String, age: u8 },
    RemoveParticipant(u32),
}

static mut STATE: State = State {
    info: SomeEvent {
        name_of_event: None,
    },
    participants: Vec::new(),
};

#[no_mangle]
unsafe extern "C" fn init() {
    let input: SomeEvent = msg::load().unwrap();
    STATE = State {
        info: input,
        participants: Vec::new(),
    }
}

#[no_mangle]
unsafe extern "C" fn handle() {
    let input: Action = msg::load().unwrap();

    let participant: Participant = match input {
        Action::AddParticipant { name, age } => {
            let number_of_participant = STATE.participants.len();
            STATE.participants.push(Participant {
                id: number_of_participant as u32,
                name,
                age,
                public_key: msg::source(),
            });
            STATE.participants[number_of_participant].clone()
        }
        Action::RemoveParticipant(id) => {
            let index = STATE.participants.iter().position(|p| p.id == id).unwrap();
            let t = &STATE.participants.remove(index);
            t.clone()
        }
    };

    msg::reply(participant, 1000).unwrap();
}

#[derive(TypeInfo, Decode)]
pub enum ReadStateAction {
    AllParticipants,
    NumberOfParticipants,
    AllState,
    ParticipantById(u32),
    ParticipantByPubKey(ActorId),
}

#[derive(TypeInfo, Encode)]
pub enum StateOutput {
    AllParticipants(Vec<Participant>),
    AllState(State),
    NumberOfParticipants(u32),
    Participant(Option<Participant>),
}

#[no_mangle]
unsafe extern "C" fn meta_state() -> *mut [i32; 2] {
    let action: ReadStateAction = msg::load().expect("failed to decode input argument");
    let result: StateOutput = match action {
        ReadStateAction::AllParticipants => {
            StateOutput::AllParticipants(STATE.participants.clone())
        }
        ReadStateAction::AllState => StateOutput::AllState(STATE.clone()),
        ReadStateAction::NumberOfParticipants => {
            StateOutput::NumberOfParticipants(STATE.participants.len() as u32)
        }
        ReadStateAction::ParticipantById(id) => {
            let index = &STATE.participants.iter().position(|p| p.id == id);
            if index.is_some() {
                StateOutput::Participant(Some(STATE.participants[index.unwrap()].clone()))
            } else {
                StateOutput::Participant(None)
            }
        }
        ReadStateAction::ParticipantByPubKey(pub_key) => {
            let index = STATE
                .participants
                .iter()
                .position(|p| p.public_key == pub_key);
            if index.is_some() {
                StateOutput::Participant(Some(STATE.participants[index.unwrap()].clone()))
            } else {
                StateOutput::Participant(None)
            }
        }
    };
    gstd::util::to_leak_ptr(result.encode())
}

gstd::metadata! {
    title: "Example @gear-js/api",
    init:
        input: SomeEvent,
    handle:
        input: Action,
        output: Participant,
    state:
        input: ReadStateAction,
        output: StateOutput,
}
