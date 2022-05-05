FROM summerwind/actions-runner-dind:latest


RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - \
    && sudo apt install -y nodejs \
    && sudo rm -rf /var/lib/apt/lists/* \
    && sudo npm install --global npm@latest \
    && sudo npm install --global --force yarn@latest \
    && sudo mkdir -p /mnt/cashes/npm \
    && sudo mkdir -p /mnt/cashes/yarn \
    && sudo mkdir -p /mnt/docker \
    && sudo mkdir -p /home/runner/.docker/cli-plugins

COPY docker/actions-runner/startup.sh /usr/bin/startup.sh

COPY --from=docker/buildx-bin:latest /buildx /home/runner/.docker/cli-plugins/docker-buildx

RUN sudo chmod +x /home/runner/.docker/cli-plugins/docker-buildx /usr/bin/startup.sh \
    && sudo chown -R runner:runner /mnt/cashes \
    && sudo chown -R runner:docker /mnt/docker /home/runner/.docker/