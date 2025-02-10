#![no_std]

use sails_rs::{cell::RefCell, prelude::*};

mod counter;

#[derive(Default)]
pub struct CounterProgram {
    counter_state: RefCell<counter::CounterState>,
}

#[program]
impl CounterProgram {
    pub fn new() -> Self {
        Self::default()
    }

    #[route]
    pub fn counter(&self) -> counter::Counter {
        counter::Counter::new(&self.counter_state)
    }
}
