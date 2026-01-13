#![no_std]

use codec::{Decode, Encode};
use gstd::{msg, prelude::*, ActorId};

#[derive(Encode)]
pub enum MessageEvent {
    Empty,
    Complex { a: u8, b: String },
}

#[derive(Decode)]
pub enum MessageAction {
    Plain,
    SendReply,
    EmitEmptyEvent,
    EmitComplexEvent,
    LandIntoMailboxWithValue,
}

#[gstd::async_main]
async fn main() {
    let action: MessageAction = msg::load().expect("Failed to load MessageAction");

    match action {
        MessageAction::Plain => {}
        MessageAction::SendReply => {
            msg::reply(b"ok", 0).expect("Unable to send reply");
        }
        MessageAction::EmitEmptyEvent => {
            msg::send(ActorId::zero(), MessageEvent::Empty, 0).expect("Unable to send event");
        }
        MessageAction::EmitComplexEvent => {
            msg::send(
                ActorId::zero(),
                MessageEvent::Complex {
                    a: 42,
                    b: String::from("test"),
                },
                0,
            )
            .expect("Unable to send event");
        }
        MessageAction::LandIntoMailboxWithValue => {
            msg::send_with_gas(msg::source(), b"ok", 20_000_000_000, msg::value())
                .expect("Unable to send message");
        }
    };
}
