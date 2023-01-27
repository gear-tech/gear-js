use gmeta::metawasm;
use gstd::prelude::*;
use test_meta_io::Wallet;

#[metawasm]
pub trait Metawasm {
    type State = Vec<Wallet>;

    fn all_wallets(state: Self::State) -> Vec<Wallet> {
        state
    }

    fn first_wallet(state: Self::State) -> Option<Wallet> {
        state.first().cloned()
    }

    fn last_wallet(state: Self::State) -> Option<Wallet> {
        state.last().cloned()
    }
}
