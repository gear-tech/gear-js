use counter::CounterProgram;

fn main() {
    sails_rs::ClientBuilder::<CounterProgram>::from_env().build_idl();
}
