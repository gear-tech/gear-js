import { HexString } from '@gear-js/api';
import { EthereumClient } from '@vara-eth/api';
import { walletClientToSigner } from '@vara-eth/api/signer';
import { getWalletClient, Config, getPublicClient, watchConnection } from '@wagmi/core';
import { Address } from 'viem';

type Listener = () => void;

export class EthereumClientStore {
  private client: EthereumClient | undefined;
  private accountAddress: HexString | undefined;
  private listeners = new Set<Listener>();
  private unwatchConnection: (() => void) | undefined;

  constructor(
    private config: Config,
    private address: Address,
  ) {}

  getSnapshot = () => this.client;

  subscribe = (listener: Listener) => {
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

        console.log('set');

        this.client.setSigner(walletClientToSigner(walletClient));
        this.accountAddress = walletClient.account.address;
        this.emit();
      })
      .catch(() => {
        if (!this.client) throw new Error('EthereumClient not initialized');
        if (!this.accountAddress) return;

        console.log('reset');

        this.client.resetSigner();
        this.accountAddress = undefined;
        this.emit();
      });
  }

  async start() {
    const publicClient = getPublicClient(this.config);

    if (!publicClient) throw new Error('No public client available');

    const client = new EthereumClient(publicClient, this.address);
    const isInitialized = await client.waitForInitialization();

    if (!isInitialized) throw new Error('Failed to initialize EthereumClient');

    this.client = client;
    this.emit();

    this.unwatchConnection = watchConnection(this.config, { onChange: () => this.setSigner() });
    this.setSigner();
  }

  stop() {
    this.unwatchConnection?.();
    this.unwatchConnection = undefined;
  }
}
