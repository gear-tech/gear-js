use std::str::FromStr;

use ethexe_common::{
    ecdsa::{PrivateKey, Signature},
    gprimitives::{ActorId, H256},
    injected::InjectedTransaction,
    ToDigest,
};

const PRIVATE_KEY: &str = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

pub fn main() {
    let private_key = PrivateKey::from_str(PRIVATE_KEY).unwrap();

    let tx = InjectedTransaction {
        destination: ActorId::zero(),
        payload: Vec::from([0, 1, 2]).into(),
        value: 256,
        reference_block: H256::zero(),
        salt: Vec::from([3, 4, 5]).into(),
    };

    println!("hash: <{:?}>", tx.to_digest());

    let sig = Signature::create(private_key, tx);

    println!("signature: <{:?}>", sig.unwrap());
}
