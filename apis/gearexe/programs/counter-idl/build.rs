use counter::CounterProgram;
use sails_idl_gen;
use std::{env, path::PathBuf};

fn main() {
    let idl_file_path = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap()).join("counter.idl");

    sails_idl_gen::generate_idl_to_file::<CounterProgram>(&idl_file_path).unwrap();
}
