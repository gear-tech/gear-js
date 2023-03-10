use gmeta::metawasm;
use gstd::prelude::*;
use test_meta_io::{Id, Person, Wallet};

#[metawasm]
pub mod metafns {
    pub type State = Vec<Wallet>;

    pub fn wallet_by_id(state: State, id: Id) -> Option<Wallet> {
        state.into_iter().find(|w| w.id == id)
    }

    pub fn wallet_by_person(state: State, person: Person) -> Option<Wallet> {
        state.into_iter().find(|w| w.person == person)
    }

    pub fn wallet_by_u128(state: State, number: u128) -> Option<Wallet> {
        state.into_iter().find(|w| w.id.decimal == number)
    }
}
