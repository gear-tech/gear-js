import { HexString, MirrorClient } from '@vara-eth/api';
import { walletClientToSigner } from '@vara-eth/api/signer';
import { getPublicClient, getWalletClient, watchConnection } from '@wagmi/core';
import { Config } from 'wagmi';

class MirrorClientStore {
  private client: MirrorClient | undefined;
  private accountAddress: HexString | undefined;
  private listeners = new Set<() => void>();
  private unwatchConnection: (() => void) | undefined;

  constructor(
    private config: Config,
    private address: HexString,
  ) {}

  getSnapshot = () => this.client;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  };

  private emit() {
    for (const listener of this.listeners) listener();
  }

  private setSigner() {
    // to reduce number of getWalletClient calls, onChange.connector.address might be checked prior calling this method.
    // skipping it for now for the simplicity of things

    getWalletClient(this.config)
      .then((walletClient) => {
        if (!this.client) throw new Error('EthereumClient not initialized');
        if (walletClient.account.address === this.accountAddress) return;

        console.log('set mirror client signer');

        this.client.setSigner(walletClientToSigner(walletClient));
        this.accountAddress = walletClient.account.address;
        this.emit();
      })
      .catch(() => {
        if (!this.client) throw new Error('EthereumClient not initialized');
        if (!this.accountAddress) return;

        console.log('reset mirror client signer');

        this.client.resetSigner();
        this.accountAddress = undefined;
        this.emit();
      });
  }

  start() {
    const publicClient = getPublicClient(this.config);

    if (!publicClient) throw new Error('No public client available');

    this.client = new MirrorClient({ publicClient, address: this.address });
    this.emit();

    this.unwatchConnection = watchConnection(this.config, { onChange: () => this.setSigner() });
    this.setSigner();
  }

  stop() {
    this.unwatchConnection?.();
    this.unwatchConnection = undefined;
  }
}

export { MirrorClientStore };
