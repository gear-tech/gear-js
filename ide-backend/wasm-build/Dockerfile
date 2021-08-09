FROM rust:latest

RUN rustup install nightly
RUN rustup target add wasm32-unknown-unknown --toolchain nightly
RUN cargo install cargo-update

WORKDIR /

RUN apt-get update && apt-get install git
RUN git clone https://github.com/gear-tech/gear

WORKDIR /gear
RUN ls
# RUN make all
RUN cargo install --path /gear/utils/wasm-proc

RUN mkdir /wasm-build
WORKDIR /wasm-build

COPY build.sh ./
RUN chmod +x build.sh

