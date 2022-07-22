FROM rust:latest

RUN rustup install nightly
RUN rustup target add wasm32-unknown-unknown --toolchain nightly
RUN cargo install cargo-update
RUN cargo install --git https://github.com/gear-tech/gear wasm-proc
RUN apt-get update
RUN apt-get install binaryen

RUN mkdir /wasm-build
COPY build.sh /wasm-build/build.sh
RUN chmod +x /wasm-build/build.sh

WORKDIR /wasm-build
CMD [ "./build.sh" ]
