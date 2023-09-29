import { KeyringPair } from '@polkadot/keyring/types';
import { BN } from '@polkadot/util';
import { logger } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { TransferBalance } from './database/entities/transfer.entity';
import { transferRepository } from './database/repositories/transfer.repository';
import { createAccount } from './utils';
import config from './config';
import { GearApi, TransferData } from '@gear-js/api';
import { changeStatus } from './healthcheck.router';
import { rmqService } from './rmq';

interface ResponseTransferBalance {
  status?: string;
  transferredBalance?: string;
  error?: string;
}

let providerAddress = config.gear.providerAddresses[0];
const MAX_RECONNECTIONS = 10;
let reconnectionsCounter = 0;

export class TransferService {
  private account: KeyringPair;
  private balanceToTransfer: BN;
  private api: GearApi;
  private genesis: string;

  async init() {
    this.account = await createAccount(config.gear.accountSeed);
    this.balanceToTransfer = new BN(config.gear.balanceToTransfer);
    await this.connect();
  }

  get genesisHash() {
    return this.genesis;
  }

  async connect() {
    if (!providerAddress) {
      throw new Error('There are no node addresses to connect to');
    }

    this.api = new GearApi({ providerAddress });

    try {
      await this.api.isReadyOrError;
    } catch (error) {
      logger.error(`Failed to connect to ${providerAddress}`, { error });
      await this.reconnect();
    }
    await this.api.isReady;
    this.api.on('disconnected', () => {
      rmqService.sendDeleteGenesis(this.genesis);
      this.reconnect();
    });
    this.genesis = this.api.genesisHash.toHex();
    logger.info(`Connected to ${await this.api.chain()} with genesis ${this.genesis}`);
    changeStatus('ws');
  }

  async reconnect(): Promise<void> {
    if (this.api) {
      await this.api.disconnect();
      this.api = null;
    }

    reconnectionsCounter++;
    if (reconnectionsCounter > MAX_RECONNECTIONS) {
      providerAddress = config.gear.providerAddresses.filter((address) => address !== providerAddress)[0];
      reconnectionsCounter = 0;
    }

    logger.info('Attempting to reconnect');
    changeStatus('ws');
    return this.connect();
  }

  async setTransferDate(account: string, genesis: string): Promise<TransferBalance> {
    const transferBalanceTypeDB = plainToClass(TransferBalance, {
      account: `${account}.${genesis}`,
      lastTransfer: new Date(),
    });

    return transferRepository.save(transferBalanceTypeDB);
  }

  async isPossibleToTransfer(account: string, genesis: string): Promise<boolean> {
    const transfer = await transferRepository.getByAccountAndGenesis(account, genesis);

    if (!transfer) {
      return true;
    }

    return isLastTransferEarlierThanToday(transfer);
  }

  async transferBalance(to: string): Promise<ResponseTransferBalance> {
    logger.info(`Transfer balance`, { from: this.account.address, to, amount: this.balanceToTransfer.toString() });
    try {
      await this.transfer(to);
    } catch (error) {
      logger.error('Transfer balance error', { error: error.message, stack: error.stack });
      return { error: `Transfer balance to ${to} failed` };
    }
    await this.setTransferDate(to, this.genesis);
    return { status: 'ok', transferredBalance: this.balanceToTransfer.toString() };
  }

  async transfer(to: string): Promise<TransferData> {
    const tx = this.api.balance.transfer(to, this.balanceToTransfer);
    return new Promise((resolve, reject) => {
      tx.signAndSend(this.account, ({ events }) => {
        events.forEach(({ event }) => {
          const { method, data } = event;
          if (method === 'Transfer') {
            resolve(data as TransferData);
          } else if (method === 'ExtrinsicFailed') {
            reject(this.api.getExtrinsicFailedError(event).docs.filter(Boolean).join('. '));
          }
        });
      });
    });
  }
}

function isLastTransferEarlierThanToday(transfer: TransferBalance): boolean {
  const now = new Date().setHours(0, 0, 0, 0);

  return transfer.lastTransfer.setHours(0, 0, 0, 0) < now;
}

export const transferService = new TransferService();
