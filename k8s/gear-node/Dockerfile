FROM ubuntu:22.04
MAINTAINER GEAR
WORKDIR opt
RUN apt update
RUN apt install wget -y
RUN apt install xz-utils -y
RUN wget https://get.gear.rs/gear-nightly-x86_64-unknown-linux-gnu.tar.xz
RUN tar -xvf gear-nightly-x86_64-unknown-linux-gnu.tar.xz
RUN chmod +x gear

CMD ["/opt/gear", "--dev", "--tmp", "--unsafe-rpc-external", "--rpc-methods", "Unsafe", "--rpc-cors", "all"]
