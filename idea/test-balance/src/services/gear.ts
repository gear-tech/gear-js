import { KeyringPair } from '@polkadot/keyring/types';
import { BN } from '@polkadot/util';
import { logger } from '@gear-js/common';
import { GearApi, TransferData } from '@gear-js/api';
import { randomUUID } from 'node:crypto';
import { CronJob } from 'cron';

import { createAccount } from '../utils';
import config from '../config';
import { changeStatus } from '../healthcheck.router';

const MAX_RECONNECTIONS = 10;
let reconnectionsCounter = 0;

interface TBRequestParams {
  addr: string;
  correlationId: string;
  cb: (error: string, result: string) => void;
}

enum TransferEvent {
  TRANSFER = 'Transfer',
  EXTRINSIC_SUCCESS = 'ExtrinsicSuccess',
  EXTRINSIC_FAILED = 'ExtrinsicFailed',
}

export class GearService {
  private account: KeyringPair;
  private balanceToTransfer: BN;
  private api: GearApi;
  private genesis: string;
  private providerAddress: string;
  private queue: Array<TBRequestParams>;

  constructor() {
    this.providerAddress = config.gear.providerAddresses[0];
    this.queue = [];
  }

  async init() {
    this.account = await createAccount(config.gear.accountSeed);
    this.balanceToTransfer = new BN(config.gear.balanceToTransfer);
    await this.connect();
    this.processQueue();
  }

  get genesisHash() {
    return this.genesis;
  }

  async connect() {
    if (!this.providerAddress) {
      logger.error('There are no node addresses to connect to');
      process.exit(1);
    }

    this.api = new GearApi({ providerAddress: this.providerAddress });

    try {
      await this.api.isReadyOrError;
    } catch (error) {
      logger.error(`Failed to connect to ${this.providerAddress}`, { error: error.message });
      await this.reconnect();
    }
    await this.api.isReady;
    this.api.on('disconnected', () => {
      logger.error(`Disconnected from ${this.providerAddress}`);
      this.reconnect();
    });
    this.genesis = this.api.genesisHash.toHex();
    logger.info(`Connected to ${await this.api.chain()} with genesis ${this.genesis}`);
    changeStatus('ws');
  }

  async reconnect(): Promise<void> {
    this.genesis = null;
    if (this.api) {
      await this.api.disconnect();
      this.api = null;
    }

    reconnectionsCounter++;
    if (reconnectionsCounter > MAX_RECONNECTIONS) {
      this.providerAddress = config.gear.providerAddresses.filter((address) => address !== this.providerAddress)[0];
      reconnectionsCounter = 0;
    }

    logger.info('Attempting to reconnect');
    changeStatus('ws');
    return this.connect();
  }

  async sendBatch(addresses: string[]): Promise<[string[], string]> {
    const txs = addresses.map((address) => this.api.tx.balances.transferKeepAlive(address, this.balanceToTransfer));
    const batch = this.api.tx.utility.forceBatch(txs);
    const transferred = [];
    let blockHash: string;

    const correlationId = randomUUID({});

    logger.info(`Sending batch with ${addresses.length} transfers`, { addresses, correlationId });

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
                  reject({ blockHash, correlationId, error: this.api.getExtrinsicFailedError(event).docs });
                  break;
              }
            }
          })
          .catch((error) => {
            reject({ error: error.message, correlationId });
          }),
      );
      logger.info(`Batch success`, { blockHash, correlationId });
    } catch (err) {
      logger.error(`Batch error`, { ...err });
    }

    return [transferred, blockHash];
  }

  requestBalance(addr: string, correlationId: string, cb: (error: string, result: string) => void) {
    this.queue.push({ addr, correlationId, cb });
  }

  async processQueue() {
    new CronJob(
      '*/3 * * * * *',
      async () => {
        if (this.queue.length === 0) {
          return;
        }
        const requests = this.queue;
        logger.info('Processing queue', { q: this.queue.map(({ addr }) => addr) });
        this.queue = [];

        const [transferred, blockHash] = await this.sendBatch(requests.map((req) => req.addr));

        requests.forEach((req) => {
          if (transferred.includes(req.addr)) {
            logger.info(`Balance transferred to ${req.addr}`, { blockHash, correlationId: req.correlationId });
            req.cb(null, this.balanceToTransfer.toString());
          } else {
            logger.error(`Transfer balance to ${req.addr} failed`, { blockHash, correlationId: req.correlationId });
            req.cb(`Transfer balance to ${req.addr} failed`, null);
          }
        });
      },
      null,
      true,
    );
  }
}
