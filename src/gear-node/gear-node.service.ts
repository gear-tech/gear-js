import { Injectable, Logger } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { randomAsHex } from '@polkadot/util-crypto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ProgramsService } from 'src/programs/programs.service';
import {
  createKeyring,
  keyringFromJson,
  keyringFromSeed,
  keyringFromSuri,
} from './keyring';
import { GearNodeError, InvalidParamsError } from 'src/json-rpc/errors';
import { u8aToHex } from '@polkadot/util';
import { submitProgram } from './program.gear';
import { sendMessage } from './message.gear';
@Injectable()
export class GearNodeService {
  private provider: WsProvider;
  private api: ApiPromise;

  constructor(
    private readonly userService: UsersService,
    private readonly programService: ProgramsService,
  ) {
    this.provider = new WsProvider(process.env.WS_PROVIDER);
    this.createApiPromise();
  }

  private logger = new Logger('GearNodeService');

  private async createApiPromise() {
    this.api = await ApiPromise.create({ provider: this.provider });
  }

  createKeyPair(user: User) {
    if (user.seed) {
      const keyring = keyringFromSeed(user, user.seed);
      if (u8aToHex(keyring.publicKey) !== user.publicKey) {
        this.userService.addPublicKey(user, u8aToHex(keyring.publicKey));
      }
      return keyring.toJson();
    }
    const { publicKey, seed, json } = createKeyring(user);
    this.userService.addPublicKey(user, publicKey);
    this.userService.addSeed(user, seed);
    return json;
  }

  async uploadProgram(user: User, data, cb) {
    if (
      !data ||
      !data.gasLimit ||
      !data.value ||
      !data.file ||
      !data.filename
    ) {
      throw new InvalidParamsError();
    }

    const binary = this.programService.parseWASM(data.file);

    const keyring = data.keyPairJson
      ? keyringFromJson(data.keyPairJson)
      : keyringFromSeed(user, user.seed);
    if (keyring.isLocked) {
      keyring.unlock();
    }
    const salt = data.salt || randomAsHex(20);

    const programData = {
      user: user,
      name: data.filename,
      hash: null,
      blockHash: null,
      uploadedAt: null,
    };

    try {
      await submitProgram(
        this.api,
        keyring,
        binary,
        salt,
        data.initPayload || '',
        data.gasLimit,
        data.value,
        programData,
        (action, data?) => {
          if (action === 'error') {
            cb(data);
          } else if (action === 'save') {
            this.programService.saveProgram(programData);
          } else if (action === 'gear') {
            cb(undefined, data);
          }
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(user: User, messageData, cb) {
    if (
      !messageData ||
      !messageData.destination ||
      !messageData.payload ||
      !messageData.gasLimit ||
      !messageData.value
    ) {
      throw new InvalidParamsError();
    }

    const keyring = messageData.keyPairJson
      ? keyringFromJson(messageData.keyPairJson)
      : keyringFromSeed(user, user.seed);
    if (keyring.isLocked) {
      keyring.unlock();
    }

    await sendMessage(
      this.api,
      keyring,
      messageData.destination,
      messageData.payload,
      messageData.gasLimit,
      messageData.value,
      (action, data) => {
        if (action === 'error') {
          cb(data);
        } else if (action === 'gear') {
          cb(undefined, data);
        }
      },
    );
  }

  async subscribeNewHeads(cb) {
    try {
      const unsub = this.api.rpc.chain.subscribeNewHeads((header) => {
        cb(undefined, {
          hash: header.hash.toHex(),
          number: header.number.toString(),
        });
      });
      return unsub;
    } catch (error) {
      throw new GearNodeError(error.message);
    }
  }

  async totalIssuance() {
    const total = await (
      await this.api.query.balances.totalIssuance()
    ).toHuman();
    return total;
  }

  async balanceTransfer(publicKey: string, value, cb?) {
    try {
      const unsub = await this.api.tx.balances
        .transfer(publicKey, value)
        .signAndSend(keyringFromSuri('//Alice', 'Alice default'), (result) => {
          if (result.status.isFinalized) {
            if (cb) {
              cb(undefined, {
                message: `Transfer balance succeed`,
              });
            }
            unsub();
          }
        });
    } catch (error) {
      throw new GearNodeError(error.message);
    }
  }

  async getBalance(publicKey: string) {
    const { data: balance } = await this.api.query.system.account(publicKey);
    return { freeBalance: balance.free.toHuman() };
  }
}
