FROM debian:stable-slim
MAINTAINER GEAR
WORKDIR opt
RUN apt update
RUN apt install wget -y
RUN apt install xz-utils -y
RUN wget https://github.com/gear-tech/builds/releases/download/vara/vara-nightly-linux-x86_64.tar.xz
RUN tar -xvf vara-nightly-linux-x86_64.tar.xz
RUN chmod +x gear-node

CMD ["/opt/gear-node",  "--chain", "vara-dev", "--alice", "--validator", "--tmp", "--unsafe-ws-external", "--unsafe-rpc-external", "--rpc-methods", "Unsafe", "--rpc-cors", "all"]
