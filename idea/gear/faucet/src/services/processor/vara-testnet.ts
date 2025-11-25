import { GearApi, GearKeyring, TransferData } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { createLogger } from 'gear-idea-common';
import { BN } from '@polkadot/util';
import { Hex } from 'viem';

import { FaucetType, FaucetRequest } from '../../database';
import { FaucetProcessor } from './abstract';
import config from '../../config';

const MAX_RECONNECTIONS = 10;
let reconnectionsCounter = 0;

enum TransferEvent {
  TRANSFER = 'Transfer',
  EXTRINSIC_SUCCESS = 'ExtrinsicSuccess',
  EXTRINSIC_FAILED = 'ExtrinsicFailed',
}

function createAccount(seed: string): Promise<KeyringPair> {
  if (seed.startsWith('//')) {
    return GearKeyring.fromSuri(seed);
  }
  if (seed.startsWith('0x')) {
    return GearKeyring.fromSeed(seed);
  }

  return GearKeyring.fromMnemonic(seed);
}

const logger = createLogger('vara');

export class VaraTestnetProcessor extends FaucetProcessor {
  private account: KeyringPair;
  private providerAddress: string;
  private balanceToTransfer: BN;
  private bridgeAmount: BN;
  private api?: GearApi;
  private genesis?: string;

  public async init() {
    this.setLogger(logger);
    this.account = await createAccount(config.varaTestnet.accountSeed);
    logger.info('Account created', { addr: this.account.address });
    this.balanceToTransfer = new BN(config.varaTestnet.balanceToTransfer * 1e12);
    this.bridgeAmount = new BN(BigInt(config.bridge.tvaraAmount) * BigInt(1e12));
    this.providerAddress = config.varaTestnet.providerAddresses[0];
    await this.connect();
  }

  protected get cronInterval(): string {
    return config.varaTestnet.cronTime;
  }

  protected get type(): FaucetType[] {
    return [FaucetType.VaraTestnet, FaucetType.BridgeVaraTestnet];
  }

  public get genesisHash() {
    return this.genesis;
  }

  protected async handleRequests(requests: FaucetRequest[]) {
    logger.info('Processing requests', { length: requests.length, target: 'vara_testnet' });

    const success: number[] = [];
    const fail: number[] = [];

    const [transferred, blockHash] = await this._sendBatch(
      requests.map((req) => [
        req.address,
        req.type === FaucetType.BridgeVaraTestnet ? this.bridgeAmount : this.balanceToTransfer,
      ]),
    );

    requests.forEach((req) => {
      if (transferred.includes(req.address)) {
        success.push(req.id);
        logger.info(`Request ${req.id} succeeded`, { blockHash });
      } else {
        fail.push(req.id);
        logger.error(`Request ${req.id} failed`, { blockHash, address: req.address });
      }
    });

    return { success, fail };
  }

  private async connect() {
    if (!this.providerAddress) {
      logger.error('There are no node addresses to connect to');
      process.exit(1);
    }

    this.api = new GearApi({ providerAddress: this.providerAddress, noInitWarn: true });

    try {
      await this.api.isReadyOrError;
    } catch (error: any) {
      logger.error(`Failed to connect to ${this.providerAddress}`, { error: error.message });
      await this.reconnect();
    }
    await this.api.isReady;
    this.api.on('disconnected', () => {
      logger.error(`Disconnected from ${this.providerAddress}`);
      this.reconnect();
    });
    this.genesis = this.api.genesisHash.toHex();
    logger.info(`Connected to ${await this.api.chain()}`, { genesis: this.genesis });
  }

  async reconnect(): Promise<void> {
    this.genesis = undefined;
    if (this.api) {
      await this.api.disconnect();
      this.api = undefined;
    }

    reconnectionsCounter++;
    if (reconnectionsCounter > MAX_RECONNECTIONS) {
      this.providerAddress = config.varaTestnet.providerAddresses.filter(
        (address) => address !== this.providerAddress,
      )[0];
      reconnectionsCounter = 0;
    }

    logger.info('Attempting to reconnect');
    return this.connect();
  }

  private async _sendBatch(
    requests: [address: string, value: BN][],
  ): Promise<[transferred: Hex[], blockHash: string | undefined]> {
    if (!this.api) {
      throw new Error('GearApi is not initialized');
    }

    const txs = requests.map(([address, value]) => this.api!.tx.balances.transferKeepAlive(address, value));
    const batch = this.api.tx.utility.forceBatch(txs);
    const transferred: Hex[] = [];
    let blockHash: string | undefined;

    logger.info(`Sending batch with ${requests.length} transfers`, { requests });

    try {
      await new Promise<any>((resolve, reject) =>
        batch
          .signAndSend(this.account, ({ events, status }) => {
            if (!status.isInBlock) {
              return;
            }

            blockHash = status.asInBlock.toHex();

            for (const { event } of events) {
              switch (event.method) {
                case TransferEvent.TRANSFER:
                  transferred.push((event.data as TransferData).to.toHex());
                  break;
                case TransferEvent.EXTRINSIC_SUCCESS:
                  resolve(null);
                  break;
                case TransferEvent.EXTRINSIC_FAILED:
                  reject({ blockHash, error: this.api!.getExtrinsicFailedError(event).docs });
                  break;
              }
            }
          })
          .catch((error) => {
            reject({ error: error.message });
          }),
      );
      logger.info(`Batch success`, { blockHash, transferred });
    } catch (error: any) {
      logger.error(`Batch error`, { ...error });
    }

    return [transferred, blockHash];
  }
}
