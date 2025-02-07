use sails_rs::{cell::RefCell, prelude::*};

#[derive(Default)]
pub struct CounterState {
    value: u32,
}

pub struct Counter<'a> {
    state: &'a RefCell<CounterState>,
}

impl<'a> Counter<'a> {
    pub fn new(state: &'a RefCell<CounterState>) -> Self {
        Self { state }
    }
}

#[service]
impl<'a> Counter<'a> {
    pub fn increment(&mut self) -> u32 {
        let mut state = self.state.borrow_mut();
        state.value = state.value + 1;
        state.value.clone()
    }

    pub fn decrement(&mut self) -> u32 {
        let mut state = self.state.borrow_mut();
        state.value = state.value - 1;
        state.value
    }

    pub fn get_value(&self) -> u32 {
        self.state.borrow().value
    }
}
