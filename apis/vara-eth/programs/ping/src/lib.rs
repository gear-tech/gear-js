#![no_std]

use sails_rs::prelude::*;

#[derive(Default)]
pub struct PingProgram;

#[sails_rs::program]
impl PingProgram {
    pub fn create_prg() -> Self {
        Self::default()
    }

    #[export(route = "counter")]
    pub fn ping(&self) -> Counter {
        Counter::default()
    }
}

#[derive(Default)]
pub struct Counter;

#[sails_rs::service]
impl Counter {
    #[export]
    pub fn ping(&mut self) -> String {
        "pong".to_string()
    }
}
