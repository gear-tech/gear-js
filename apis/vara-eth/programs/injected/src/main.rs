use ethexe_common::{
    ecdsa::{PrivateKey, Signature, SignedMessage},
    gprimitives::{ActorId, H256},
    injected::{InjectedTransaction, Promise},
    ToDigest,
};
use gear_core::rpc::ReplyInfo;
use gear_core_errors::{ReplyCode, SuccessReplyReason};
use std::str::FromStr;

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

    let sig = Signature::create(&private_key, tx.clone());

    println!("signature: <{}>", sig.unwrap());

    let msg_id = tx.to_message_id();

    println!("message_id: <{:?}>", msg_id);

    let promise = Promise {
        tx_hash: tx.to_hash(),
        reply: ReplyInfo {
            payload: Vec::from([0, 1, 2]).into(),
            value: 256,
            code: ReplyCode::Success(SuccessReplyReason::Manual),
        },
    };

    let msg = SignedMessage::create(private_key, promise).unwrap();

    println!(
        "promise_hash: <0x{}>",
        hex::encode(msg.data().to_digest().0)
    );
    println!("promise_signature: <{}>", msg.signature());
}
