#![no_std]

extern crate alloc;

use alloc::string::String;
use codec::{Decode, Encode};
use gmeta::{InOut, Metadata};
use gstd::prelude::*;
use scale_info::TypeInfo;

pub struct ProgramMetadata;

impl Metadata for ProgramMetadata {
    type Init = InOut<InputStruct, String>;
    type Handle = InOut<InputStruct, String>;
    type Reply = InputStruct;
    type Others = InOut<(), ()>;
    type Signal = ();
    type State = InOut<(), ()>;
}

#[derive(TypeInfo, Decode, Encode)]
pub struct InputStruct {
    pub input: String,
}
