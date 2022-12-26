use gmeta::metawasm;
use gstd::prelude::*;
use test_meta_io::{Id, Person, Wallet};

#[metawasm]
pub trait Metawasm {
    type State = Vec<Wallet>;

    fn wallet_by_id(id: Id, state: Self::State) -> Option<Wallet> {
        state.into_iter().find(|w| w.id == id)
    }

    fn wallet_by_person(person: Person, state: Self::State) -> Option<Wallet> {
        state.into_iter().find(|w| w.person == person)
    }
}