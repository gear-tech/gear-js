import { GearApi, GearKeyring } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { Injectable, Logger } from '@nestjs/common';
import { ProgramsService } from 'src/programs/programs.service';
import { GearNodeError } from 'src/json-rpc/errors';
import { GearNodeEvents } from './events';
import { RpcCallback } from 'src/json-rpc/interfaces';

const logger = new Logger('GearNodeService');
@Injectable()
export class GearNodeService {
  private api: GearApi;
  private rootKeyring: KeyringPair;

  constructor(private readonly programService: ProgramsService, private readonly subscription: GearNodeEvents) {
    GearApi.create({ providerAddress: process.env.WS_PROVIDER }).then(async (api) => {
      this.api = api;
      const accountSeed = process.env.ACCOUNT_SEED;
      this.rootKeyring = accountSeed
        ? await GearKeyring.fromSeed(process.env.ACCOUNT_SEED, 'websiteAccount')
        : (await GearKeyring.create('websiteAccount')).keyring;
      this.updateWebsiteAccountBalance();
      this.subscription.subscribeAllEvents(api);
    });
  }

  async updateWebsiteAccountBalance() {
    const sudoSeed = process.env.SUDO_SEED;
    const sudoKeyring = parseInt(process.env.DEBUG)
      ? GearKeyring.fromSuri('//Alice', 'Alice default')
      : await GearKeyring.fromSeed('websiteAccount', sudoSeed);

    const currentBalance = await this.api.balance.findOut(this.rootKeyring.address);
    if (currentBalance.toNumber() < +process.env.SITE_ACCOUNT_BALANCE) {
      this.balanceTransfer(
        {
          from: sudoKeyring,
          to: this.rootKeyring.address,
          value: +process.env.SITE_ACCOUNT_BALANCE - currentBalance.toNumber(),
        },
        (error, data) => {
          if (error) {
            logger.error(error);
          } else {
            logger.log(data);
          }
        },
      );
    }
  }

  async balanceTransfer(
    options: {
      from?: KeyringPair;
      to: string;
      value: number;
    },
    callback?: RpcCallback,
  ): Promise<void> {
    if (
      options.to !== this.rootKeyring.address &&
      (await this.api.balance.findOut(this.rootKeyring.address)).toNumber() < options.value
    ) {
      await this.updateWebsiteAccountBalance();
    }
    if (!options.from) {
      options.from = this.rootKeyring;
    }

    try {
      this.api.balance
        .transferBalance(options.from, options.to, options.value, () => {})
        .then(() => {
          callback(undefined, 'Transfer balance succeed');
        });
    } catch (error) {
      logger.error(error.message);
      throw new GearNodeError(error.message);
    }
  }

  async getBalance(publicKey: string): Promise<{ freeBalance: string }> {
    try {
      const balance = await this.api.balance.findOut(publicKey);
      return { freeBalance: balance.toHuman() };
    } catch (error) {
      logger.error(error);
      throw new GearNodeError(error.message);
    }
  }

  async getAllNoGUIPrograms() {
    let programs = await this.api.program.allUploadedPrograms();
    const filter = async (array, condition) => {
      const results = await Promise.all(array.map(condition));
      return array.filter((_v, index) => results[index]);
    };
    programs = await filter(programs, async (hash) => !(await this.programService.isInDB(hash)));
    return programs;
  }
}
