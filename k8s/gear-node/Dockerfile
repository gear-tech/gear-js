FROM debian:stable-slim
MAINTAINER GEAR
WORKDIR opt
RUN apt update
RUN apt install wget -y
RUN apt install xz-utils -y
RUN wget https://get.gear.rs/gear-nightly-linux-x86_64.tar.xz
RUN tar -xvf gear-nightly-linux-x86_64.tar.xz
RUN chmod +x gear

CMD ["gear",  "--dev", "--tmp", "--unsafe-ws-external", "--unsafe-rpc-external", "--rpc-methods", "Unsafe", "--rpc-cors", "all"]
