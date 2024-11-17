#![no_std]

extern crate alloc;

use alloc::{string::String, vec::Vec};
use codec::{Decode, Encode};
use gmeta::{InOut, Metadata};
use gstd::{
    collections::{BTreeMap, BTreeSet},
    prelude::*,
    ActorId,
};
use primitive_types::H256;
use scale_info::TypeInfo;

pub struct ProgramMetadata;

impl Metadata for ProgramMetadata {
    type Init = InOut<InitInput, InitOutput>;
    type Handle = InOut<Action, String>;
    type Reply = ReplyType;
    type Others = InOut<(), ()>;
    type Signal = H256;
    type State = InOut<Option<u32>, Vec<Wallet>>;
}

#[derive(TypeInfo, Decode, Encode)]
pub enum InitInput {
    InputStruct(InputStruct),
    BTreeSetInput(BTreeSet<u8>),
}

#[derive(TypeInfo, Decode, Encode)]
pub enum InitOutput {
    Text(String),
    BTreeMapOutput(BTreeMap<String, u8>),
}

#[derive(TypeInfo, Decode, Encode)]
pub struct InputStruct {
    pub input: String,
}

#[derive(TypeInfo, Decode, Encode)]
pub enum ReplyType {
    TextReply(String),
    StructReply(InputStruct),
}

#[derive(TypeInfo, Default, Decode, Encode)]
pub struct SomeStruct<P1, P2> {
    array8: [P1; 8],
    array32: [P2; 32],
    actor: ActorId,
}

#[derive(TypeInfo, Decode, Encode)]
pub struct X((u8, u16));

#[derive(TypeInfo, Decode, Encode)]
pub enum Action {
    One(Option<String>),
    Two(Vec<X>),
    Three { field1: Result<(u8, String), i32> },
    Four(SomeStruct<u128, u8>),
    Five(SomeStruct<String, X>),
    Six(ActorId, EmptyStruct),
    Input(String),
}

#[derive(TypeInfo, Encode, Decode, Clone)]
pub struct EmptyStruct {
    pub empty: (),
}

// Additional to primary types
#[derive(TypeInfo, Decode, Encode, Debug, PartialEq, Eq, Clone)]
pub struct Id {
    pub decimal: u128,
    pub hex: Vec<u8>,
}

#[derive(TypeInfo, Decode, Encode, Clone, Debug, PartialEq, Eq)]
pub struct Person {
    pub surname: String,
    pub name: String,
}

#[derive(TypeInfo, Decode, Encode, Clone, Debug)]
pub struct Wallet {
    pub id: Id,
    pub person: Person,
}

pub enum State {
    DappMeta(String),
    Data(Vec<Wallet>),
}
