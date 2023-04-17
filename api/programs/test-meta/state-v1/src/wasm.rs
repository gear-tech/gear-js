use gmeta::metawasm;
use gstd::{debug, prelude::*};
use test_meta_io::Wallet;

#[metawasm]
pub mod metafns {
    pub type State = Vec<Wallet>;

    pub fn all_wallets(state: State) -> Vec<Wallet> {
        state
    }

    pub fn first_wallet(state: State) -> Option<Wallet> {
        state.first().cloned()
    }

    pub fn last_wallet(state: State) -> Option<Wallet> {
        state.last().cloned()
    }
}
